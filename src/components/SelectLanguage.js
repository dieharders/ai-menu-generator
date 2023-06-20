import styles from "./SelectLanguage.module.scss";

const SelectLanguage = ({ onAction }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const language = queryParameters.get("lang") || "en";

    return (
        <form onChange={onAction} className={styles.container}>
            <label>Language: </label>
            <select id="languages" name="languages" defaultValue={language}>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="ru">Russian</option>
            </select>
        </form>
    )
};

export default SelectLanguage;
