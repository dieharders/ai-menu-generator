import SearchBar from "./SearchBar";
import { GeminiAPIKeyInput, OpenAIAPIKeyInput } from "./DevAPIKeyInput";
import { GenerateMenuButton } from "./Generate";
import styles from "./Home.module.scss";

const Home = () => {
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
        <h2 className={styles.title}>Find a menu</h2>
        <SearchBar />
      </div>
      <h3 className={styles.or}>OR</h3>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Snap a menu</h2>
        <GeminiAPIKeyInput />
        <OpenAIAPIKeyInput />
        <p className={styles.description}>Take a picture of a menu to start.</p>
        <GenerateMenuButton />
      </div>
      <div className={styles.footerContainer}>
        <div className={styles.footer}>
          Built w/ Google Gemini ♊ | Dedicated to Diane 💞
        </div>
      </div>
    </div>
  );
};

export default Home;
