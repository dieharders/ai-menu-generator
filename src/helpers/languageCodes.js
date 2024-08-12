export const languages = [
  "en",
  "fr",
  "de",
  "es",
  "ru",
  // "ko",
  // "zh",
  // "ja",
];

export const languageCodes = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Spanish",
  ru: "Russian",
  // @TODO Need i18n or other lib for proper display of Asian text
  // ko: "Korean",
  // zh: "Chinese",
  // ja: "Japanese",
};

export const getLanguageLabel = (languageCode) => {
  return languageCodes?.[languageCode];
};
