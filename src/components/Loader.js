import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.book}>
        <div
          className={[styles["book__pg"], styles["-shadow"]].join(" ")}
        ></div>
        <div className={styles["book__pg"]}></div>
        <div
          className={[styles["book__pg"], styles["book__pg--2"]].join(" ")}
        ></div>
        <div
          className={[styles["book__pg"], styles["book__pg--3"]].join(" ")}
        ></div>
        <div
          className={[styles["book__pg"], styles["book__pg--4"]].join(" ")}
        ></div>
        <div
          className={[styles["book__pg"], styles["book__pg--5"]].join(" ")}
        ></div>
      </div>
    </div>
  );
};
