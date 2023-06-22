import { useState } from "react";
import { getLanguageLabel } from "../helpers/languageCodes";
import styles from "./SelectLanguage.module.scss";

const SelectLanguage = ({ onAction, showForm }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const lang = queryParameters.get("lang");
    const language = lang === "undefined" ? "en" : lang;
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

    // @TODO Read all available languages from data and only render those options...
    const renderSelection = (
        <select id="languages" name="languages" defaultValue={language} className={styles.selection}>
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ru">Russian</option>
        </select>
    );

    const renderFormAndLabel = (
        <form onChange={onAction || onLangSelection} className={[styles.container, styles.bgColor].join(' ')}>
            <label className={styles.langLabel}>Language: </label>
            {renderSelection}
        </form>
    );

    const renderFormAsButton = (
        <form onChange={onAction || onLangSelection} className={styles.containerAsButton}>
            {renderSelection}
        </form>
    );

    return showForm ? renderFormAndLabel : renderFormAsButton;
};

export default SelectLanguage;
