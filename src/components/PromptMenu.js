import { useState } from "react";
import { aiActions } from "../actions/aiActions";
import { DEFAULT_MENU_ID } from "../components/Generate";
import { StorageAPI } from "../helpers/storage";
import { Loader } from "./Loader";
import styles from "./PromptMenu.module.scss";

export const PromptMenu = () => {
  const params = new URLSearchParams(window.location.search);
  const menuId = params.get("id");
  const menus = StorageAPI.getItem(menuId);
  const menu = menus?.find((m) => m.id === DEFAULT_MENU_ID);
  const [apiKeySubmitted, setAPIKeySubmitted] = useState(false);
  const { requestAnswer } = aiActions();
  const [isFetching, setIsFetching] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [answer, setAnswer] = useState("");

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
    setShowPrompt(true);
  };
  const handleEnterEvent = (event) => {
    if (event.key === "Enter") handlePromptRequest();
  };

  return (
    <div className={styles.container}>
      {isFetching && <Loader />}
      {!isFetching && answer && (
        <textarea
          className={styles.answerContainer}
          readOnly={true}
          type="text"
          value={answer}
        />
      )}
      {!apiKeySubmitted && !isFetching && (
        <input
          type="password"
          name="input-gemini-api-key"
          placeholder="Gemini API key"
          className={styles.inputText}
        />
      )}
      {!isFetching && showPrompt && (
        <input
          type="text"
          name="input-prompt-menu"
          onKeyDown={handleEnterEvent}
          placeholder="Ask me anything"
          className={styles.inputText}
        />
        // @TODO Dismiss answer button...
        // @TODO Add a button to mouse click to send prompt request.
        // @TODO Button next to dismiss to read aloud the answer.
        // @TODO Add timer to unhide prompt input after 5 second delay
      )}
    </div>
  );
};
