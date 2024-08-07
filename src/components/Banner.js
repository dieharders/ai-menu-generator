import styles from "./Banner.module.scss";

const Banner = ({ title, backgroundURL, children }) => {
  const defaultImage = require("../assets/banners/wolfhoundbar.png");
  const path = backgroundURL || defaultImage;
  const url = `url(${path})`;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div
          className={styles.background}
          style={{ backgroundImage: url }}
        ></div>
        <h1 className={styles.name}>{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Banner;
