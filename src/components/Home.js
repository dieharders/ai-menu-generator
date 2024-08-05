import SearchBar from "./SearchBar";
import { GenerateMenuButton } from "./Generate";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Foodieee</h1>
        <p className={styles.description}>
          Automatically build accessible food menus for everyone.
        </p>
      </div>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Find a menu</h2>
        <SearchBar />
      </div>
      <h3 className={styles.or}>OR</h3>
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Snap a menu</h2>
        <p className={styles.description}>
          Upload a picture of a menu to start.
        </p>
        <GenerateMenuButton />
      </div>
    </div>
  );
};

export default Home;
