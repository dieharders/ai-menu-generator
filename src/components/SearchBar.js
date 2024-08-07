import { useState, useEffect, useMemo } from "react";
import { ReactComponent as FormSubmitSVG } from "../assets/icons/icon-search.svg";
import languageCodes from "../helpers/languageCodes";
import { StorageAPI } from "../helpers/storage";
import { DEFAULT_MENU_ID } from "../components/Generate";
import styles from "./SearchBar.module.scss";

const SearchBar = ({ handleSubmit, handleInputChange }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const [submittedValue, setSubmittedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const defaultMenuExists = StorageAPI.getItem(DEFAULT_MENU_ID);
  const isMenuButtonDisabled = useMemo(() => !defaultMenuExists, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmittedValue(inputValue);
    setInputValue("");
    handleSubmit && handleSubmit();
  };

  const onChange = (e) => {
    setInputValue(e.target.value);
    handleInputChange && handleInputChange();
  };

  useEffect(() => {
    if (!submittedValue) return;
    queryParams.set("id", submittedValue);
    // Set the default language. Could include a toggle w/ search bar?
    const lang = queryParams.get("lang");
    const language = languageCodes?.[lang] ? lang : "en";
    queryParams.set("lang", language);
    const query = queryParams.toString();
    window.location.href = `${window.location.origin}/?${query}`;
  }, [submittedValue]);

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={onChange}
          placeholder="Menu ID"
          className={styles.inputText}
        />
        <button type="submit" name="Find Business" className={styles.button}>
          <FormSubmitSVG className={styles.submitIcon} />
        </button>
      </div>
      {/* Show saved menu button */}
      {defaultMenuExists && (
        <button
          disabled={isMenuButtonDisabled}
          className={styles.inputButton}
          onClick={() => {
            // Go to generated page
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set("id", DEFAULT_MENU_ID);
            const language = "en";
            queryParams.set("lang", language);
            const query = queryParams.toString();
            window.location.href = `${window.location.origin}/?${query}`;
          }}
        >
          👀 View saved menu
        </button>
      )}
    </form>
  );
};

export default SearchBar;
