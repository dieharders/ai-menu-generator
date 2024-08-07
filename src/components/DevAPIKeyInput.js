import styles from "./DevAPIKeyInput.module.scss";

export const DevAPIKeyInput = () => {
  const onChange = (e) => {
    // setInputValue(e.target.value);
    // handleInputChange && handleInputChange();
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        name="input-api-key"
        onChange={onChange}
        placeholder="Gemini API key"
        className={styles.inputText}
      />
    </div>
  );
};
