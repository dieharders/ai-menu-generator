import { useState, useContext } from "react";
import { Context } from "../Context";
import { useAiActions } from "../actions/useAiActions";
import { DEFAULT_MENU_ID } from "../helpers/constants";
import { StorageAPI } from "../helpers/storage";
import cachedMenus from "../data.json";
import { Loader } from "./Loader";
import { ReactComponent as IconSend } from "../assets/icons/icon-send.svg";
import { ReactComponent as IconX } from "../assets/icons/icon-cross-2.svg";
import { ReactComponent as SpeakAloud } from "../assets/icons/icon-speak-aloud.svg";
import { GeminiAPIKeyInput, OpenAIAPIKeyInput } from "./ApiKeyInput";
import toast from "react-hot-toast";
import styles from "./PromptMenu.module.scss";

export const PromptMenu = ({ promptText = "", setPromptText }) => {
  const params = new URLSearchParams(window.location.search);
  const isPrint = params.get("print");
  const menuId = params.get("id");
  const menus = StorageAPI.getItem(menuId) || cachedMenus?.[menuId];
  const menu = menus?.find((m) => m.id === DEFAULT_MENU_ID) || menus?.[0];
  const [showApiKey, setShowAPIKey] = useState(false);
  const { geminiAPIKeyRef, openaiAPIKeyRef } = useContext(Context);
  const { requestAnswer } = useAiActions();
  const [isFetching, setIsFetching] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnswerOpen, setIsAnswerOpen] = useState(false);
  const isLocalEnv = window.location.hostname.includes("localhost");

  const setVegan = () =>
    setPromptText(
      "Look through each item and determine if they are or have ingredients that make them vegan, then list out all items that are vegan."
    );

  const setVegie = () =>
    setPromptText(
      "Look through each item and determine if they are or have ingredients that make them vegetarian, then list out all items that are vegetarian."
    );

  const setMeaty = () =>
    setPromptText(
      "Look through each item and determine if they contain meat, then list out all items that have meat."
    );

  const setCheapest = () =>
    setPromptText(
      "Look through each item and note their price, then tell me the cheapest item."
    );

  const setDrinks = () =>
    setPromptText(
      "Think through each item on menu and determine if they a drink/beverage, then only list out items that are a drink."
    );

  const setNonAlcohol = () =>
    setPromptText(
      "Think through each item on menu and determine if they a drink/beverage that contains alcohol, then only list out items that are a non-alcoholic drink."
    );

  const setMealsOnly = () =>
    setPromptText(
      "Look through each item and determine if they are a meal of food (not drinks, condiments or other), then list out only items that are meals."
    );

  const setShortVersion = () =>
    setPromptText(
      "Think through each item on menu then summarize that item (combine name, section name, price, ngredients, allergy, health, category, item description into one shorter description), then return a short list of every menu item."
    );

  const handlePromptRequest = async () => {
    try {
      if (!promptText) {
        // Show prev answer
        if (answer) setIsAnswerOpen(true);
        throw new Error("Please ask a question.");
      }
      setIsFetching(true);
      setAnswer("Thinking...");
      const info = menu?.sourceDocument || ""; // original menu source data (markdown)
      const res = await requestAnswer({ prompt: promptText, info });
      setAnswer(`${res}`);
      setIsAnswerOpen(true);
      setPromptText("");
      setIsFetching(false);
    } catch (err) {
      console.error(`${err}`);
      return err;
    }
  };
  const toastHandlePrompt = async () => {
    await toast.promise(handlePromptRequest(), {
      style: {
        minWidth: "6rem",
      },
      position: "top-center",
      loading: "Thinking...",
      success: (data) => {
        if (data instanceof Error) throw data;
        return <b>Here is your answer!</b>;
      },
      error: (err) => <b>Could not answer your question 😭{`\n${err}`}</b>,
    });
    setIsFetching(false);
    return;
  };
  const handleEnterEvent = (event) => {
    if (event.key === "Enter") toastHandlePrompt();
  };

  const onDismiss = () => {
    // Hide answer
    setIsAnswerOpen(false);
  };

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
   */
  const onSpeakAloud = () => {
    const utterance = new SpeechSynthesisUtterance(answer);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };
  const stopSpeakAloud = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className={styles.container}>
      {/* Loading anim */}
      {isFetching && <Loader />}
      {!isFetching && (
        <div className={styles.promptsContainer}>
          <button className={styles.promptExample} onClick={setVegan}>
            Vegan
          </button>
          <button className={styles.promptExample} onClick={setVegie}>
            Vegetarian
          </button>
          <button className={styles.promptExample} onClick={setMeaty}>
            Meatlovers
          </button>
          <button className={styles.promptExample} onClick={setCheapest}>
            Cheapest
          </button>
          <button className={styles.promptExample} onClick={setDrinks}>
            Drinks
          </button>
          <button className={styles.promptExample} onClick={setNonAlcohol}>
            Non-alcoholic
          </button>
          <button className={styles.promptExample} onClick={setMealsOnly}>
            Meals
          </button>
          <button className={styles.promptExample} onClick={setShortVersion}>
            Shorter version
          </button>
        </div>
      )}
      {!isFetching && answer && isAnswerOpen && (
        <div className={styles.buttonsContainer}>
          {/* Read aloud answer button */}
          <button
            title="Read Aloud"
            className={styles.btnTool}
            onClick={isSpeaking ? stopSpeakAloud : onSpeakAloud}
          >
            <SpeakAloud className={styles.btnIcon} />
          </button>
          {/* Dismiss answer button */}
          <button
            title="Dismiss Answer"
            className={styles.btnTool}
            onClick={onDismiss}
          >
            <IconX className={styles.btnIcon} />
          </button>
        </div>
      )}
      {/* Answer text box */}
      {!isFetching && answer && isAnswerOpen && (
        <textarea
          className={styles.answerContainer}
          readOnly={true}
          type="text"
          value={answer}
        />
      )}
      {/* API key input */}
      {showApiKey && !isFetching && (
        <GeminiAPIKeyInput
          inputValue={geminiAPIKeyRef}
          className={styles.inputText}
        />
      )}
      {showApiKey && !isFetching && (
        <OpenAIAPIKeyInput
          inputValue={openaiAPIKeyRef}
          className={styles.inputText}
        />
      )}
      {/* Prompt input */}
      {!isFetching && !isPrint && (
        <div className={styles.promptInputContainer}>
          <input
            type="text"
            name="input-prompt-menu"
            value={promptText}
            onKeyDown={handleEnterEvent}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Ask me anything..."
            className={styles.inputText}
            style={{ paddingRight: "6rem" }}
          />
          <button
            title="Ask question"
            className={styles.sendButton}
            onClick={toastHandlePrompt}
          >
            <IconSend className={styles.btnIcon} />
          </button>
          {/* API key button (show/hide) */}
          {isLocalEnv && (
            <button
              title="Show api key input"
              className={styles.showInputBtn}
              onClick={() => setShowAPIKey((prev) => !prev)}
            >
              <div className={styles.btnIcon}>🔐</div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
