import { useCallback, useContext, useRef } from "react";
import { Context } from "../Context";
import { useAiActions } from "../actions/useAiActions";
import { structuredOutputFormat } from "../helpers/formats";
import { StorageAPI } from "../helpers/storage";
import { languages } from "../helpers/languageCodes";
import { GeminiAPIKeyInput, OpenAIAPIKeyInput } from "./DevAPIKeyInput";
import { Loader } from "./Loader";
import toast from "react-hot-toast";
import styles from "./Generate.module.scss";

export const DEFAULT_MENU_ID = "DEFAULT_MENU";
export const SAVED_MENU_ID = "SAVED_MENU";

export const GenerateMenu = ({
  isDisabled,
  setIsDisabled,
  stepIndex,
  setStepIndex,
}) => {
  const {
    structureMenuData,
    extractMenuDataFromImage,
    translateMenuDataToLanguage,
    // generateMenuImages,
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

  const onClick = useCallback(async () => {
    try {
      setStepIndex(4);
      setIsDisabled(true);
      const files = fileInputValue || [];
      // @TODO Exit if name/hash already exists (if storing in cloud)
      // ...
      setLoadingText("Extracting details from photo(s)...");
      const menuDocument = await extractMenuDataFromImage(files);
      setLoadingText("Processing menu details...");
      // Get structured data
      const structuredMenuPrompt = `Convert this markdown text to json format: ${menuDocument}\n\nExample output:\n\n${structuredOutputFormat}\n\nResponse:`;
      let structuredData = await structureMenuData({
        prompt: structuredMenuPrompt,
        menuDocument,
      });

      // Generate images
      // @TODO Disabling this for now. Want to refactor this to request once per image.
      // setLoadingText("Generating images...");
      // structuredData = await generateMenuImages({ data: structuredData });

      // Create translations
      // @TODO Instead of translating everything at once, add a button on menu page to translate specified lang.
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
          const timeout = 10000; // 5sec for AI calls, but 10sec for Vercel edge funcs🥺
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
    } catch (err) {
      reset();
      return `${err}`;
    }
  }, [
    extractMenuDataFromImage,
    fileInputValue,
    reset,
    setIsDisabled,
    setLoadingText,
    setStepIndex,
    structureMenuData,
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
          <h2>Convert image(s) to menu.</h2>
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
          <h1 className={styles.title}>1. Snap a pic!</h1>
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
          <h1 className={styles.title}>Enter api keys</h1>
          {/* API keys menu */}
          <div className={styles.apiMenuContainer}>
            <span>For testing only</span>
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
        <button
          className={styles.btn}
          onClick={() => {
            const isLocal = window.location.hostname.includes("localhost");
            // Show api keys menu ONLY if running locally
            setStepIndex(isLocal ? 1 : 2);
          }}
        >
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
