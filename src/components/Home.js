import { useState } from "react";
import SearchBar from "./SearchBar";
import { GeminiAPIKeyInput, OpenAIAPIKeyInput } from "./DevAPIKeyInput";
import { GenerateMenuButton } from "./Generate";
import styles from "./Home.module.scss";

const Home = ({ setMenuId }) => {
  const [showKeyInputs, setShowKeyInputs] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.glow}></div>
        <h1 className={styles.appTitle}>Omni Menu</h1>
        <p className={styles.description}>
          Interact with any food menu pic. Talk to your menu in your native
          language, ask questions and discover dietary details.
        </p>
      </div>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Saved menus</h2>
        <SearchBar setMenuId={setMenuId} />
      </div>
      <h3 className={styles.or}>OR</h3>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Create a menu</h2>
        {/* API keys menu */}
        {!isDisabled && (
          <div className={styles.apiMenuContainer}>
            <span>Enter api keys</span>
            <button
              className={styles.showKeysBtn}
              onClick={() => setShowKeyInputs((prev) => !prev)}
            >
              🔐
            </button>
          </div>
        )}
        {showKeyInputs && (
          <span className={styles.keysContainer}>
            <GeminiAPIKeyInput />
            <OpenAIAPIKeyInput />
          </span>
        )}
        <GenerateMenuButton
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
        />
      </div>
      {/* Footer */}
      <div className={styles.footerContainer}>
        <div className={styles.footer}>
          Built w/ Google Gemini ♊ | Dedicated to Diane 💞
        </div>
      </div>
    </div>
  );
};

export default Home;
