const languageCodes = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    es: "Spanish",
    ru: "Russian"
};

export const getLanguageLabel = (languageCode) => {
    return languageCodes?.[languageCode];
};

export default languageCodes;
