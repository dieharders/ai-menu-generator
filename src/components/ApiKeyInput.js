import styles from "./ApiKeyInput.module.scss";

export const GeminiAPIKeyInput = ({ className, inputValue }) => {
  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-gemini-api-key"
        placeholder="Gemini API key"
        className={className || styles.inputText}
        onChange={(e) => {
          if (e.target?.value) inputValue.current = e.target.value;
        }}
      />
    </div>
  );
};

export const OpenAIAPIKeyInput = ({ className, inputValue }) => {
  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-openai-api-key"
        placeholder="OpenAI API key"
        className={className || styles.inputText}
        onChange={(e) => {
          if (e.target?.value) inputValue.current = e.target.value;
        }}
      />
    </div>
  );
};
