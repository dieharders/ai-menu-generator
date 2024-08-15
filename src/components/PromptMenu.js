import { useState, useContext } from "react";
import { Context } from "../Context";
import { useAiActions } from "../actions/useAiActions";
import { DEFAULT_MENU_ID } from "../components/Generate";
import { StorageAPI } from "../helpers/storage";
import cachedMenus from "../data.json";
import { Loader } from "./Loader";
import { ReactComponent as IconSend } from "../assets/icons/icon-send.svg";
import { ReactComponent as IconX } from "../assets/icons/icon-cross-2.svg";
import { ReactComponent as SpeakAloud } from "../assets/icons/icon-speak-aloud.svg";
import { GeminiAPIKeyInput } from "./DevAPIKeyInput";
import toast from "react-hot-toast";
import styles from "./PromptMenu.module.scss";

export const PromptMenu = () => {
  const params = new URLSearchParams(window.location.search);
  const isPrint = params.get("print");
  const menuId = params.get("id");
  const menus = StorageAPI.getItem(menuId) || cachedMenus?.[menuId];
  const menu = menus?.find((m) => m.id === DEFAULT_MENU_ID) || menus?.[0];
  const [showApiKey, setShowAPIKey] = useState(false);
  const { geminiAPIKeyRef } = useContext(Context);
  const { requestAnswer } = useAiActions();
  const [isFetching, setIsFetching] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnswerOpen, setIsAnswerOpen] = useState(false);

  const handlePromptRequest = async () => {
    try {
      const component = document.querySelector("input[name=input-prompt-menu]");
      const promptText = component?.value;
      if (!promptText) {
        // Show prev answer
        if (answer) setIsAnswerOpen(true);
        throw new Error("Please ask a question.");
      }
      setIsFetching(true);
      setAnswer("Thinking...");
      const info = menu?.sourceDocument || ""; // original menu source data (markdown)
      const res = await requestAnswer({ prompt: promptText, info });
      setAnswer(`Question: ${promptText}\n\nAnswer: ${res}`);
      setIsAnswerOpen(true);
      setTimeout(() => {
        setIsFetching(false);
      }, 5000); // show prompt input after 5 sec
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
      {isFetching && <Loader />}
      {!isFetching && answer && isAnswerOpen && (
        <div className={styles.buttonsContainer}>
          {/* // Read aloud answer button */}
          <button
            title="Read Aloud"
            className={styles.btnTool}
            onClick={isSpeaking ? stopSpeakAloud : onSpeakAloud}
          >
            <SpeakAloud className={styles.btnIcon} />
          </button>
          {/* // Dismiss answer button */}
          <button
            title="Dismiss Answer"
            className={styles.btnTool}
            onClick={onDismiss}
          >
            <IconX className={styles.btnIcon} />
          </button>
        </div>
      )}
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
      {/* Prompt input */}
      {!isFetching && !isPrint && (
        <div className={styles.promptInputContainer}>
          <input
            type="text"
            name="input-prompt-menu"
            onKeyDown={handleEnterEvent}
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
          <button
            title="Show api key input"
            className={styles.showInputBtn}
            onClick={() => setShowAPIKey((prev) => !prev)}
          >
            <div className={styles.btnIcon}>🔐</div>
          </button>
        </div>
      )}
    </div>
  );
};
