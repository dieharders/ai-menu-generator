import { useState, useCallback, useContext, useRef } from "react";
import { Context } from "../Context";
import { useAiActions, OpenAIModels } from "../actions/useAiActions";
import { assignUniqueIds } from "../helpers/transformData";
import { StorageAPI } from "../helpers/storage";
import { languages } from "../helpers/languageCodes";
import toast from "react-hot-toast";
import styles from "./Generate.module.scss";

const createFileHash = (_files = []) => {
  // @TODO Create a hash of the input files or hash of multiple hashes.
  return "";
};

export const DEFAULT_MENU_ID = "DEFAULT_MENU";
export const SAVED_MENU_ID = "SAVED_MENU";

export const GenerateMenuButton = ({ isDisabled, setIsDisabled }) => {
  const {
    extractMenuDataFromImage,
    convertMenuDataToStructured,
    translateMenuDataToLanguage,
    generateImage,
  } = useAiActions();
  const [isFetching, setIsFetching] = useState(false);
  const { openaiAPIKey, fileInputValue, setFileInputValue, loadingText } =
    useContext(Context);

  // Text to show in toast while generating
  const signalAborted = useRef(false);
  const setLoadingText = useCallback(
    (text) => {
      if (loadingText?.current?.innerText) loadingText.current.innerText = text;
      if (signalAborted.current) throw new Error("Menu generation aborted.");
    },
    [loadingText]
  );

  const getImageInputFiles = useCallback(() => {
    return fileInputValue || [];
  }, [fileInputValue]);

  const reset = useCallback(() => {
    signalAborted.current = false;
    loadingText.current = null;
    setIsDisabled(true);
    setIsFetching(false);
    const input = document.querySelector("input[type=file]");
    if (input?.value) input.value = "";
    setFileInputValue([]);
  }, [loadingText, setFileInputValue, setIsDisabled]);

  const waitForTimeout = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const encodeB64 = async (imageSrc) => {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Compress image and resize to 256p
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 256, 256);

        const dataURL = canvas.toDataURL("image/jpg", 0.7);
        resolve(dataURL);
      };

      img.onerror = () => {
        reject("Failed to load image");
      };

      img.src = imageSrc;
    });
  };

  const generateImages = useCallback(
    async (data, numGenerations) => {
      const maxGenerations = 10;
      const isOverLimit = numGenerations >= maxGenerations;
      // Check api key
      const key =
        document.querySelector("input[name=input-openai-api-key]")?.value ||
        openaiAPIKey;
      const timeout = isOverLimit || !key ? 100 : 25000; // 25 sec or 100ms if over limit or no expected requests

      // Return an image as a base64 string
      const createEncodedImage = async (description, index, total) => {
        let source = "";
        let img = (await import("../assets/images/placeholder.png")).default;
        try {
          // Call image generation model
          if (!isOverLimit && key) {
            setLoadingText(
              `Generating image from description (${
                index - 1
              }/${total}):\n\n${description}`
            );

            img = await generateImage({
              prompt: description,
              model: OpenAIModels.DALL_E_2,
            });
          }
          setLoadingText("Skipping image generation. Assigning placeholder.");
        } catch (err) {
          const msg = `Failed to generate image:\n${err}`;
          if (isOverLimit || !key) console.error(msg);
          else toast.error(msg);
        }
        source = await encodeB64(img);

        return source;
      };

      // Loop thru all items and generate images
      const menu = {
        id: data.id,
        description: data.imageDescription,
      };
      const menuItems = data.items.map((item) => ({
        id: item.id,
        description: item.imageDescription,
      }));
      const newData = { ...data };
      const intervalImages = async () => {
        let index = 0;
        const totalItems = [menu, ...menuItems];
        for (const item of totalItems) {
          setLoadingText(
            `Processing image for item (${index + 1}/${
              totalItems.length - 1
            }):\n\n${item}`
          );
          try {
            // Generate image for item
            const descr = item?.description;
            const imageSource = await createEncodedImage(
              descr,
              index + 1,
              totalItems.length - 1
            );
            // Assign for menu banner image
            if (index === 0) newData.imageSource = imageSource;
            else {
              // Assign for menu items
              const itemIndex = newData.items.findIndex(
                (i) => i.id === item.id
              );
              newData.items[itemIndex].imageSource = imageSource;
            }
          } catch (err) {
            toast.error(`Failed to process image:\n${err}`);
          }
          index += 1;

          // Wait between calls
          await waitForTimeout(timeout);
        }
        return;
      };

      // fire api calls on a rolling basis (due to request limits)
      await intervalImages();

      return newData;
    },
    [generateImage, openaiAPIKey, setLoadingText]
  );

  const onClick = useCallback(async () => {
    try {
      setIsDisabled(true);
      setIsFetching(true);
      const files = getImageInputFiles();
      // @TODO Exit if name/hash already exists (if storing in cloud)
      // ...
      const hash = createFileHash(files);
      setLoadingText("Extracting details from photo(s)...");
      const menuDocument = await extractMenuDataFromImage(files);
      setLoadingText("Processing menu details...");
      // Get structured data
      let structuredData = await convertMenuDataToStructured(menuDocument);
      if (Object.keys(structuredData).length === 0) {
        throw new Error("Failed to structure data.");
      } else {
        setLoadingText("Assigning ids to items...");
        structuredData = assignUniqueIds({
          data: structuredData,
          id: DEFAULT_MENU_ID, // mark as the primary document
          hash,
        });
        // Generate images
        setLoadingText("Generating images...");
        structuredData = await generateImages(structuredData);
        // Create translations
        setLoadingText("Processing translations...");
        const timeout = 5000; // 5 seconds
        const translations = [];
        const iterateTranslations = async () => {
          let langIndex = 1;
          for (const lang of languages) {
            setLoadingText(
              `Translating for ${lang} (${langIndex}/${
                languages.length - 1
              }) ...`
            );
            // Skip translating the source data
            if (structuredData.language === lang) continue;
            // Translate
            const res = await translateMenuDataToLanguage({
              data: menuDocument,
              lang,
              primary: structuredData,
            });
            langIndex += 1;
            // Record result
            translations.push(res);
            // Wait between calls
            await waitForTimeout(timeout);
          }
          return;
        };
        await iterateTranslations();
        // Store all data locally (text & images)
        const menuId = structuredData?.id;
        structuredData.sourceDocument = menuDocument; // save original text in primary data
        if (!menuId) throw new Error("No id found for menu.");
        const payload = [structuredData, ...translations];
        StorageAPI.setItem(SAVED_MENU_ID, payload);

        reset();
      }
    } catch (err) {
      reset();
      return `${err}`;
    }
  }, [
    convertMenuDataToStructured,
    extractMenuDataFromImage,
    generateImages,
    getImageInputFiles,
    reset,
    setIsDisabled,
    setLoadingText,
    translateMenuDataToLanguage,
  ]);

  const FileInput = () => {
    return (
      <div className={styles.fileInputContainer}>
        <div className={styles.camContainer}>
          <div className={styles.camera}>+📸</div>
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const _inputURL = e.target.value;
              const input = document.querySelector("input[type=file]");
              const files = input?.files;
              files && setFileInputValue(files);
              files && setIsDisabled(files?.length === 0);
            }}
          />
        </div>
      </div>
    );
  };

  const LoadingComponent = () => {
    return (
      <div className={styles.loadingToast}>
        <b>Generating...this may take a few minutes</b>
        <p ref={loadingText}>Reading photo(s)...</p>
      </div>
    );
  };

  const GenerateButton = () => {
    return (
      <button
        disabled={isDisabled}
        className={styles.inputButton}
        onClick={async () =>
          toast.promise(onClick(), {
            style: {
              minWidth: "6rem",
            },
            position: "top-center",
            loading: <LoadingComponent />,
            success: (data) => {
              // Prevents success event when canceling promise
              if (!data?.ok) throw new Error(data);
              return <b>Menu saved! You may view it now.</b>;
            },
            error: (err) => (
              <div>
                <b>Failed to generate menu 😭</b>
                <p>{err?.message}</p>
              </div>
            ),
          })
        }
      >
        ✨Generate
      </button>
    );
  };

  const Fetching = () => {
    return (
      <>
        {/* Instructions */}
        <div className={styles.instructions}>
          <h1>3. Finish</h1>
          <h2>Please wait while your menu is created.</h2>
        </div>
        {/* Cancel button */}
        <button
          className={styles.back}
          onClick={() => {
            toast("Canceling request, please wait...");
            signalAborted.current = true;
          }}
        >
          ❌ Cancel Generation
        </button>
      </>
    );
  };

  const Main = () => {
    return (
      <>
        {/* Instructions */}
        <div className={styles.instructions}>
          <h1>{isDisabled ? "1. Snap!" : "2. Create"}</h1>
          <h2>
            {isDisabled
              ? "Take picture(s) of a menu to start"
              : "Convert images to interactive menu"}
          </h2>
        </div>
        {/* File input */}
        {isDisabled && <FileInput />}
        {/* Generate button */}
        {!isDisabled && <GenerateButton />}
        {/* Back button */}
        {!isDisabled && (
          <button className={styles.back} onClick={reset}>
            ↩ Back
          </button>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {isFetching ? <Fetching /> : <Main />}
    </div>
  );
};
