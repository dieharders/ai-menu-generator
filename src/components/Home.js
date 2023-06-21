import SearchBar from "./SearchBar";
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>International Dish</h1>
      <SearchBar />
    </div>
  );
};

export default Home;
