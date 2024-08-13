import { useState } from "react";
import SearchBar from "./SearchBar";
import { GenerateMenu } from "./Generate";
import styles from "./Home.module.scss";

const Home = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <div className={styles.container}>
      {/* App title */}
      <h1 className={styles.appTitle}>
        <span className={styles.appTitleContainer}>Oh!</span>
        <span>😲</span>
        <span className={styles.appTitleContainer}>Menu</span>
      </h1>
      <div className={styles.titleContainer}>
        <p className={styles.description}>
          Interact with any food menu pic in multiple languages. Browse
          nutrition and other info.
        </p>
      </div>
      <div className={styles.menusContainer}>
        {/* Saved Menus */}
        <div className={styles.menuContainer}>
          <h2 className={styles.title}>Saved menus</h2>
          <SearchBar />
        </div>
        {/* Create Menus */}
        <div className={styles.menuContainer}>
          <GenerateMenu
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
          />
        </div>
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
