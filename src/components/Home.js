import SearchBar from "./SearchBar";
import { DevAPIKeyInput } from "./DevAPIKeyInput";
import { GenerateMenuButton } from "./Generate";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>FoodSee</h1>
        <p className={styles.description}>
          Convert pics to interactive food menus.
        </p>
      </div>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Find a menu</h2>
        <SearchBar />
      </div>
      <h3 className={styles.or}>OR</h3>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Snap a menu</h2>
        <DevAPIKeyInput />
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
