const languageCodes = {
    en: "English",
    de: "German",
    fr: "French",
    es: "Spanish",
    ru: "Russian"
};

export const getLanguageLabel = (languageCode) => {
    return languageCodes?.[languageCode];
};

export default languageCodes;
