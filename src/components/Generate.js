import { useCallback, useContext, useRef } from "react";
import { Context } from "../Context";
import { useAiActions } from "../actions/useAiActions";
import { structuredOutputFormat } from "../helpers/formats";
import { StorageAPI } from "../helpers/storage";
import { languages, getLanguageLabel } from "../helpers/languageCodes";
import { GeminiAPIKeyInput, OpenAIAPIKeyInput } from "./ApiKeyInput";
import { Loader } from "./Loader";
import { SAVED_MENU_ID } from "../helpers/constants";
import { ReactComponent as ImagesIcon } from "../assets/icons/icon-images.svg";
import toast from "react-hot-toast";
import styles from "./Generate.module.scss";

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
  } = useAiActions();
  const isLocal = window.location.hostname.includes("localhost");
  const {
    fileInputValue,
    setFileInputValue,
    loadingText,
    geminiAPIKeyRef,
    openaiAPIKeyRef,
  } = useContext(Context);
  const languageChoices = useRef([]);
  // Used to abort the current fetch request(s)
  const controller = useRef(new AbortController());
  const signal = controller.current.signal;
  // Text to show in toast while generating
  const setLoadingText = useCallback(
    (text) => {
      if (loadingText?.current?.innerText) loadingText.current.innerText = text;
    },
    [loadingText]
  );

  const reset = useCallback(() => {
    setStepIndex(0);
    controller.current = new AbortController();
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
      // Prevent if no language chosen
      if (languageChoices.current.length === 0)
        return new Error("Please choose at least one language 🌐.");
      setStepIndex(4);
      setIsDisabled(true);
      const files = fileInputValue || [];
      // @TODO Exit if name/hash already exists (if storing in cloud)
      // ...
      setLoadingText("Extracting details from photo(s)...");
      const menuDocument = await extractMenuDataFromImage(files, signal);
      setLoadingText("Processing menu details...");
      // Get structured data
      const structuredMenuPrompt = `Convert this markdown text:\n\n${menuDocument}\n\nto JSON schema:\n\n${structuredOutputFormat}\n\nResponse:`;
      let structuredData = await structureMenuData({
        prompt: structuredMenuPrompt,
        menuDocument,
        signal,
      });

      // Create translations
      setLoadingText("Processing translations...");
      const iterateTranslations = async () => {
        const results = [];
        let langIndex = 1;

        for (const lang of languageChoices.current) {
          setLoadingText(
            `Translating for ${lang} (${langIndex}/${languageChoices.current.length}) ...`
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
            signal,
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
    signal,
    structureMenuData,
    translateMenuDataToLanguage,
  ]);

  const FileInput = () => {
    return (
      <div className={styles.fileInputContainer}>
        <div className={styles.camContainer}>
          <div className={styles.camera}>
            <ImagesIcon />
          </div>
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            multiple
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
            onClick={() => controller.current.abort("Menu generation aborted.")}
          >
            ❌ Cancel Generation
          </button>
        </div>
      </>
    );
  };

  const LanguageCheckboxes = ({ language }) => {
    const value = useRef(false);
    const label = (
      <label htmlFor={language}>{getLanguageLabel(language)}</label>
    );
    const input = (
      <input
        ref={value}
        id={language}
        type="checkbox"
        className={styles.checkbox}
        onChange={(val) => {
          const v = val.target.checked;
          const prev = languageChoices.current;
          // add
          if (v === true && !prev.includes(language))
            languageChoices.current.push(language);
          // remove
          else
            languageChoices.current = languageChoices.current.filter(
              (e) => e !== language
            );
        }}
      />
    );
    return (
      <span>
        {label}
        {input}
      </span>
    );
  };

  // Generate menu
  const Menu4 = () => {
    return (
      <>
        <div className={styles.instructions}>
          {/* Title */}
          <h1 className={styles.title}>🌐 Choose languages</h1>
        </div>
        {/* Choose languages to translate to */}
        <form action="" className={styles.langChoiceContainer}>
          {languages?.map((lang) => (
            <LanguageCheckboxes key={lang} language={lang} />
          ))}
        </form>
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
          <h1 className={styles.title}>Snap a pic of your menu</h1>
        </div>
        {/* File Input */}
        <FileInput />
        <div className={styles.btnsContainer}>
          {/* Back button */}
          <button
            className={styles.btn}
            onClick={() => (isLocal ? setStepIndex(1) : setStepIndex(0))}
          >
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
        </div>
        <span style={{ width: "100%" }}>
          {/* API keys menu */}
          <div className={styles.apiMenuContainer}>
            <span>For testing only</span>
            <div className={styles.showKeysBtn}>🔐</div>
          </div>
          <span className={styles.keysContainer}>
            <GeminiAPIKeyInput inputValue={geminiAPIKeyRef} />
            <OpenAIAPIKeyInput inputValue={openaiAPIKeyRef} />
          </span>
        </span>
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
          <h1 className={styles.title}>Convert images to menu</h1>
          {/* Instructions */}
          <h2 className={styles.instrText}>📷+🤖=📃</h2>
        </div>
        {/* Next button */}
        <button
          className={styles.btn}
          onClick={() => {
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
