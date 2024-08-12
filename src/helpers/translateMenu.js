import toast from "react-hot-toast";

const translateMenu = ({ data, menu, lang }) => {
  const englishMenu = data?.find((i) => i.language === "en");

  if (!lang) {
    toast.error("No target language available!");
    // Return default menu data
    return englishMenu;
  }

  return menu;
};

export default translateMenu;
