import styles from "./DevAPIKeyInput.module.scss";

export const GeminiAPIKeyInput = ({ className, setKey }) => {
  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-gemini-api-key"
        placeholder="Gemini API key"
        onChange={(e) => setKey && e.target.value && setKey(e.target.value)}
        className={className || styles.inputText}
      />
    </div>
  );
};

export const OpenAIAPIKeyInput = ({ className, setKey }) => {
  return (
    <div className={styles.container}>
      <input
        type="password"
        name="input-openai-api-key"
        placeholder="OpenAI API key"
        onChange={(e) => setKey && e.target.value && setKey(e.target.value)}
        className={className || styles.inputText}
      />
    </div>
  );
};
