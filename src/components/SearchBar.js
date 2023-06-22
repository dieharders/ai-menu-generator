import { useState, useEffect } from 'react';
import { ReactComponent as FormSubmitSVG } from "../assets/icons/icon-search.svg";
import styles from "./SearchBar.module.scss";

const SearchBar = ({ handleSubmit, handleInputChange }) => {
    const queryParams = new URLSearchParams(window.location.search);
    const [submittedValue, setSubmittedValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        setSubmittedValue(inputValue);
        setInputValue('');
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
        const language = (lang || lang !== "undefined") ? lang : "en";
        queryParams.set("lang", language);
        const query = queryParams.toString();
        window.location.href = `${window.location.origin}/?${query}`;
    }, [submittedValue]);

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <input
                type="text"
                value={inputValue}
                onChange={onChange}
                placeholder="Business ID"
                className={styles.inputText}
            />
            <button type="submit" name="Find Business" className={styles.button}>
                <FormSubmitSVG className={styles.submitIcon} />
            </button>
        </form>
    );
};

export default SearchBar;
