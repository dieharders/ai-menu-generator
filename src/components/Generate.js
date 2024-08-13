import { useCallback, useContext, useRef } from "react";
import { Context } from "../Context";
import { useAiActions, OpenAIModels } from "../actions/useAiActions";
import { assignUniqueIds } from "../helpers/transformData";
import { StorageAPI } from "../helpers/storage";
import { languages } from "../helpers/languageCodes";
import { GeminiAPIKeyInput, OpenAIAPIKeyInput } from "./DevAPIKeyInput";
import { Loader } from "./Loader";
import toast from "react-hot-toast";
import styles from "./Generate.module.scss";

const createFileHash = (_files = []) => {
  // @TODO Create a hash of the input files or hash of multiple hashes.
  return "";
};

export const DEFAULT_MENU_ID = "DEFAULT_MENU";
export const SAVED_MENU_ID = "SAVED_MENU";

export const GenerateMenu = ({
  isDisabled,
  setIsDisabled,
  stepIndex,
  setStepIndex,
}) => {
  const {
    extractMenuDataFromImage,
    convertMenuDataToStructured,
    translateMenuDataToLanguage,
    generateImage,
  } = useAiActions();
  const {
    fileInputValue,
    setFileInputValue,
    loadingText,
    geminiAPIKeyRef,
    openaiAPIKeyRef,
  } = useContext(Context);

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
    setStepIndex(0);
    signalAborted.current = false;
    loadingText.current = null;
    setIsDisabled(true);
    const input = document.querySelector("input[type=file]");
    if (input?.value) input.value = "";
    setFileInputValue([]);
  }, [loadingText, setFileInputValue, setIsDisabled, setStepIndex]);

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
    async (data) => {
      const maxGenerations = 10;

      // Check api key
      const key = openaiAPIKeyRef.current;

      // Return an image as a base64 string
      const createEncodedImage = async (description, index, total) => {
        let source = "";
        const isOverLimit = index >= maxGenerations;
        try {
          // Call image generation model
          if (!isOverLimit && key) {
            setLoadingText(
              `Generating image from description (${index}/${total}):\n\n${description}`
            );

            const imgRes = await generateImage({
              prompt: description,
              model: OpenAIModels.DALL_E_2,
            });
            const parsed = imgRes?.data?.[0]?.["b64_json"];
            source = `data:image/png;base64,${parsed}`;
          } else {
            const img = (await import("../assets/images/placeholder.png"))
              .default;
            source = await encodeB64(img);
          }
          setLoadingText("Skipping image generation. Assigning placeholder.");
        } catch (err) {
          const msg = `Failed to generate image:\n${err}`;
          if (isOverLimit || !key) console.error(msg);
          else toast.error(msg);
          const img = (await import("../assets/images/placeholder.png"))
            .default;
          source = await encodeB64(img);
        }

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
              index,
              totalItems.length
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
          const isOverLimit = index >= maxGenerations;
          const timeout = isOverLimit || !key ? 100 : 25000; // 25 sec or 100ms if over limit or no expected requests
          await waitForTimeout(timeout);
        }
        return;
      };

      // fire api calls on a rolling basis (due to request limits)
      await intervalImages();

      return newData;
    },
    [generateImage, openaiAPIKeyRef, setLoadingText]
  );

  const onClick = useCallback(async () => {
    try {
      setStepIndex(4);
      setIsDisabled(true);
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
        const iterateTranslations = async () => {
          const results = [];
          let langIndex = 1;
          for (const lang of languages) {
            setLoadingText(
              `Translating for ${lang} (${langIndex}/${languages.length}) ...`
            );
            // Skip translating the source data again
            if (structuredData.language === lang) continue;
            // Wait between calls
            const timeout = 5000; // 5 seconds
            await waitForTimeout(timeout);
            // Translate
            const res = await translateMenuDataToLanguage({
              data: menuDocument,
              lang,
              primary: structuredData, // denote the source doc
            });
            // Record result
            langIndex += 1;
            results.push(res);
          }
          return results;
        };
        const translations = await iterateTranslations();
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
    setStepIndex,
    translateMenuDataToLanguage,
  ]);

  const FileInput = () => {
    return (
      <div className={styles.fileInputContainer}>
        <div className={styles.camContainer}>
          <div className={styles.camera}>
            <div>📸</div>
          </div>
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
        {/* Header */}
        <b>Generating...this may take a few minutes. Do not exit page.</b>
        {/* Event details */}
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
              if (data && !data.ok) throw new Error(data);
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

  const Loading = () => {
    return (
      <>
        <div className={styles.instructions}>
          {/* Title */}
          <h1 className={styles.title}>Building menu...</h1>
          {/* Instructions */}
          <b className={styles.loadingInstruction}>
            Stay on page until complete.
          </b>
          <div className={styles.loaderContainer}>
            <Loader className={styles.loaderContainer} />
          </div>
        </div>
        <div className={styles.btnsContainer}>
          {/* Cancel button */}
          <button
            className={styles.btn}
            onClick={() => {
              toast("Canceling request, please wait...");
              signalAborted.current = true;
            }}
          >
            ❌ Cancel Generation
          </button>
        </div>
      </>
    );
  };

  const Menu4 = () => {
    return (
      <>
        <div className={styles.instructions}>
          {/* Title */}
          <h1 className={styles.title}>3. Start</h1>
          {/* Instructions */}
          <h2>Convert images to an interactive menu.</h2>
        </div>
        {/* Generate button */}
        <GenerateButton />
        <div className={styles.btnsContainer}>
          {/* Back button */}
          <button className={styles.btn} onClick={() => setStepIndex(2)}>
            ↩ Back
          </button>
        </div>
      </>
    );
  };

  const Menu3 = () => {
    return (
      <>
        <div className={styles.instructions}>
          {/* Title */}
          <h1 className={styles.title}>2. Snap a pic!</h1>
          {/* Instructions */}
          <h2>Take picture(s) of your menu to upload.</h2>
        </div>
        {/* File Input */}
        <FileInput />
        <div className={styles.btnsContainer}>
          {/* Back button */}
          <button className={styles.btn} onClick={() => setStepIndex(1)}>
            ↩ Back
          </button>
          {/* Next button */}
          <button
            className={styles.btn}
            onClick={() => setStepIndex(3)}
            disabled={isDisabled}
          >
            Next ➡
          </button>
        </div>
      </>
    );
  };

  const Menu2 = () => {
    return (
      <>
        <div className={styles.instructions}>
          {/* Title */}
          <h1 className={styles.title}>1. Enter api keys</h1>
          {/* API keys menu */}
          <div className={styles.apiMenuContainer}>
            <span>Testing purposes only</span>
            <div className={styles.showKeysBtn}>🔐</div>
          </div>
          <span className={styles.keysContainer}>
            <GeminiAPIKeyInput inputValue={geminiAPIKeyRef} />
            <OpenAIAPIKeyInput inputValue={openaiAPIKeyRef} />
          </span>
        </div>
        <div className={styles.btnsContainer}>
          {/* Back button */}
          <button
            className={styles.btn}
            onClick={() => {
              setStepIndex(0);
              reset();
            }}
          >
            ↩ Back
          </button>
          {/* Next button */}
          <button className={styles.btn} onClick={() => setStepIndex(2)}>
            Next ➡
          </button>
        </div>
      </>
    );
  };

  const Main = () => {
    return (
      <>
        <div className={styles.instructions}>
          {/* Title */}
          <h1 className={styles.title}>Create a menu</h1>
          {/* Instructions */}
          <h2 style={{ textAlign: "center", fontSize: "3rem" }}>📷+🤖=📃</h2>
        </div>
        {/* Next button */}
        <button className={styles.btn} onClick={() => setStepIndex(1)}>
          🚀 Start
        </button>
      </>
    );
  };

  const switchMenu = () => {
    switch (stepIndex) {
      case 0:
        return <Main />;
      case 1:
        return <Menu2 />;
      case 2:
        return <Menu3 />;
      case 3:
        return <Menu4 />;
      case 4:
        return <Loading />;
      default:
        return <Main />;
    }
  };

  return <div className={styles.container}>{switchMenu()}</div>;
};
