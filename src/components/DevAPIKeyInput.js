import styles from "./DevAPIKeyInput.module.scss";

export const GeminiAPIKeyInput = () => {
  // const onChange = (e) => {
  //   setGeminiInputValue(e.target.value);
  // };

  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-gemini-api-key"
        // onChange={onChange}
        placeholder="Gemini API key"
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
        className={styles.inputText}
      />
    </div>
  );
};
