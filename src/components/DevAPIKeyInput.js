import styles from "./DevAPIKeyInput.module.scss";

export const GeminiAPIKeyInput = () => {
  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-gemini-api-key"
        placeholder="Gemini API key"
        // onChange={(e) => setKey(e.target.value)}
        className={styles.inputText}
      />
    </div>
  );
};

export const OpenAIAPIKeyInput = () => {
  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-openai-api-key"
        placeholder="OpenAI API key"
        // onChange={(e) => setKey(e.target.value)}
        className={styles.inputText}
      />
    </div>
  );
};
