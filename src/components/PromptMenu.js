import { useState } from "react";
import { aiActions } from "../actions/aiActions";
import { DEFAULT_MENU_ID } from "../components/Generate";
import { StorageAPI } from "../helpers/storage";
import { Loader } from "./Loader";
import { ReactComponent as IconSend } from "../assets/icons/icon-send.svg";
import { ReactComponent as IconX } from "../assets/icons/icon-cross-2.svg";
import { ReactComponent as SpeakAloud } from "../assets/icons/icon-speak-aloud.svg";
import styles from "./PromptMenu.module.scss";

export const PromptMenu = () => {
  const params = new URLSearchParams(window.location.search);
  const menuId = params.get("id");
  const menus = StorageAPI.getItem(menuId);
  const menu = menus?.find((m) => m.id === DEFAULT_MENU_ID);
  const [showApiKey, setShowAPIKey] = useState(false);
  const { requestAnswer } = aiActions();
  const [isFetching, setIsFetching] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [answer, setAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePromptRequest = async () => {
    setIsFetching(true);
    setShowPrompt(false);
    setAnswer("Thinking...");
    const info = menu.sourceDocument || ""; // original menu source data (markdown)
    const component = document.querySelector("input[name=input-prompt-menu]");
    const promptText = component?.value;
    const res = await requestAnswer({ prompt: promptText, info });
    res && setAPIKeySubmitted(true);
    setAnswer(`Question: ${promptText}\n\nAnswer: ${res}`);
    setIsFetching(false);
    setTimeout(() => {
      setShowPrompt(true);
    }, 5000); // show after 5 sec
  };
  const handleEnterEvent = (event) => {
    if (event.key === "Enter") handlePromptRequest();
  };

  const onDismiss = () => {
    // Clear answer value
    setAnswer("");
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
      {!isFetching && answer && (
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
      {!isFetching && answer && (
        <textarea
          className={styles.answerContainer}
          readOnly={true}
          type="text"
          value={answer}
        />
      )}
      {/* API key input */}
      {showApiKey && !isFetching && (
        <input
          type="password"
          name="input-gemini-api-key"
          placeholder="Gemini API key"
          className={styles.inputText}
        />
      )}
      {/* Prompt input */}
      {!isFetching && showPrompt && (
        <div className={styles.promptInputContainer}>
          <input
            type="text"
            name="input-prompt-menu"
            onKeyDown={handleEnterEvent}
            placeholder="Ask me anything"
            className={styles.inputText}
            style={{ paddingRight: "6rem" }}
          />
          <button
            title="Ask question"
            className={styles.sendButton}
            onClick={handlePromptRequest}
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
