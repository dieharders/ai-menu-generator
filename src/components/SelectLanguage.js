import { useState } from "react";
import { getLanguageLabel } from "../helpers/languageCodes";
import languageCodes from "../helpers/languageCodes";
import { languages } from "../helpers/languageCodes";
import styles from "./SelectLanguage.module.scss";

const SelectLanguage = ({ onAction, showForm }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const lang = queryParameters.get("lang");
  const language = languageCodes?.[lang] ? lang : "en";
  const [currentLang, setCurrentLang] = useState();

  const onLangSelection = (e) => {
    const code = e?.target?.value;
    const label = getLanguageLabel(code);
    queryParameters.set("lang", code);
    const query = queryParameters.toString();
    const newLocation = `${window.location.origin}/?${query}`;
    e.preventDefault();
    setCurrentLang(label);
    window.location = newLocation;
  };

  // Read all available languages from data and only render those options
  const renderLanguageOptions = (arr) => {
    return arr?.map((code) => {
      const label = getLanguageLabel(code);
      return (
        <option key={code} value={code}>
          {label}
        </option>
      );
    });
  };

  const renderSelection = (
    <select
      id="languages"
      name="languages"
      defaultValue={language}
      className={styles.selection}
    >
      {renderLanguageOptions(languages)}
    </select>
  );

  const renderFormAndLabel = (
    <form
      onChange={onAction || onLangSelection}
      className={[styles.container, styles.bgColor].join(" ")}
    >
      <label className={styles.langLabel}>Language: </label>
      {renderSelection}
    </form>
  );

  const renderFormAsButton = (
    <form
      onChange={onAction || onLangSelection}
      className={styles.containerAsButton}
    >
      {renderSelection}
    </form>
  );

  return showForm ? renderFormAndLabel : renderFormAsButton;
};

export default SelectLanguage;
