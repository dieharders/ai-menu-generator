import SearchBar from "./SearchBar";
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>International Dish</h1>
      <p className={styles.description}>Join us in building accessible menus with pictures for the whole planet to enjoy!</p>
      <SearchBar />
    </div>
  );
};

export default Home;
