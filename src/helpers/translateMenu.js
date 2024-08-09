const translateMenu = ({ data, menu, lang }) => {
  const englishMenu = data?.find((i) => i.language === "en");

  if (!lang) {
    console.error("No target language available!");
    // Return default menu data
    return englishMenu;
  }

  return menu;
};

export default translateMenu;
