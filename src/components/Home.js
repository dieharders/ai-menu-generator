import { useState } from "react";
import SearchBar from "./SearchBar";
import { GenerateMenu } from "./Generate";
import { ReactComponent as PizzaFace } from "../assets/icons/logo-pizza-face.svg";
import styles from "./Home.module.scss";

const Home = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showMenu, setShowMenu] = useState("start");

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        {/* App title */}
        <h1 className={styles.appTitle}>
          <span className={styles.appTitleContainer}>Oh!</span>
          <PizzaFace className={styles.logo} />
          <span className={styles.appTitleContainer}>Menu</span>
        </h1>
        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            Interactive food menus in multiple languages. Browse pics, nutrition
            info, ask questions. Get started by uploading your menu image.
          </p>
        </div>
        <div className={styles.btnsContainer}>
          <button
            className={`${styles.btn} ${
              showMenu === "start" ? styles.active : ""
            }`}
            onClick={() => setShowMenu("start")}
          >
            Generate 🌟 Menu
          </button>
          <button
            className={`${styles.btnView} ${
              showMenu === "view" ? styles.active : ""
            }`}
            onClick={() => setShowMenu("view")}
          >
            View 👀 Menus
          </button>
        </div>
        <div className={styles.projectLink}>
          Read more about the{" "}
          <a
            href="https://github.com/dieharders/image-menu"
            rel="noreferrer"
            target="_blank"
          >
            Github project
          </a>
        </div>
      </div>
      <div className={styles.menusContainer}>
        {/* Create Menus */}
        {showMenu === "start" && (
          <div className={styles.menuContainer}>
            <GenerateMenu
              isDisabled={isDisabled}
              setIsDisabled={setIsDisabled}
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
            />
          </div>
        )}
        {/* Saved Menus */}
        {showMenu === "view" && (
          <div className={styles.menuContainer}>
            <h2 className={styles.title}>Saved menus</h2>
            <SearchBar />
          </div>
        )}
      </div>
      {/* Footer */}
      <div className={styles.footerContainer}>
        <div className={styles.footer}>
          Built by <a href="https://www.openbrewai.com">OpenBrewAi</a> 🍺 |
          Dedicated to Diane 💖
        </div>
      </div>
    </div>
  );
};

export default Home;
