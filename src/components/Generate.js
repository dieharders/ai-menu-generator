import styles from "./Generate.module.scss";

export const GenerateMenuButton = () => {
  return (
    <div className={styles.container}>
      <input type="file" accept="image/*"></input>
    </div>
  );
};
