import SearchBar from "./SearchBar";
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <SearchBar />
    </div>
  );
};

export default Home;
