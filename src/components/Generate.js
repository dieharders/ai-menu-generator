import { aiActions } from "../actions/aiActions";
import styles from "./Generate.module.scss";

export const GenerateMenuButton = () => {
  const { extractMenuDataFromImage } = aiActions();

  return (
    <div className={styles.container}>
      <input type="file" accept="image/*"></input>
      <button
        className={styles.inputButton}
        onClick={async () => {
          try {
            const fileInput = document.querySelector("input[type=file]");
            const files = fileInput?.files;
            const res = await extractMenuDataFromImage(files);
            console.log("@@ extraction successfull:\n", res);
          } catch (err) {
            console.log("@@ extraction failed:\n", err);
          }
        }}
      >
        Generate
      </button>
    </div>
  );
};
