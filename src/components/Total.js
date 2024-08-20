import { useState } from "react";
import { PromptMenu } from "./PromptMenu";
import styles from "./Total.module.scss";

// This appears at the footer
export default function Total() {
  const [promptText, setPromptText] = useState("");

  return (
    <div className={styles.totalContainer}>
      <div className={styles.fade}></div>
      <div className={styles.total}>
        <PromptMenu promptText={promptText} setPromptText={setPromptText} />
      </div>
    </div>
  );
}
