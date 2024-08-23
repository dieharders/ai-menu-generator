import { useRef, useEffect, useMemo, useContext } from "react";
import { Context } from "../Context";
import translate from "../helpers/translateMenu";
import { StorageAPI } from "../helpers/storage";
import { languageCodes } from "../helpers/languageCodes";
import { DEFAULT_MENU_ID, SAVED_MENU_ID } from "../helpers/constants";
import cachedMenus from "../data.json"; // cached menu data

/**
 * Sets up a page.
 */
export const usePage = () => {
  const {
    menuData,
    setMenuData,
    setMenuId,
    setStoredImages,
    availableLanguages,
  } = useContext(Context);
  const queryParameters = new URLSearchParams(window.location.search);
  const menuId = queryParameters.get("id");
  const menus = useMemo(() => {
    // Determine if we should read from localStorage or from included data.json
    // @TODO Replace example menus ids with "EXAMPLE_MENU" in id so we can better tell.
    if (menuId.includes("_MENU")) return StorageAPI.getItem(SAVED_MENU_ID);
    return cachedMenus?.[menuId];
  }, [menuId]);
  const selectedLang = useRef(null);
  const lang = queryParameters.get("lang");
  const language = languageCodes?.[lang] ? lang : "en";
  const menu = menus?.find((m) => m.language === language);

  useEffect(() => {
    menuId && setMenuId(menuId);
  }, [menuId, setMenuId]);

  useEffect(() => {
    // Set menu data
    if (selectedLang.current === language || !menu) return;
    // Set translation data
    setMenuData(translate({ data: menus, menu, lang }));
    selectedLang.current = language;
    // Set available languages to display
    availableLanguages.current = menus?.map((m) => m.language);
  }, [availableLanguages, lang, language, menu, menus, setMenuData]);

  // Track our record of persisted images on disk.
  // Watch "menuData" to detect changes on menu data when fetching images.
  useEffect(() => {
    const master_menu = menuId.includes("_MENU")
      ? StorageAPI.getItem(SAVED_MENU_ID)
      : cachedMenus?.[menuId];

    const data = master_menu?.find((i) => i.id === DEFAULT_MENU_ID);
    const items =
      data?.items?.map((i) => ({
        id: i.id,
        imageSource: i.imageSource,
      })) || [];
    const images = [
      { id: "banner", imageSource: data?.imageSource || "" },
      ...items,
    ];
    // Track changed images
    if (images?.length > 0) setStoredImages(images);
  }, [menuData, setStoredImages, menuId]);

  useEffect(() => {
    // Get color scheme from menu data
    const hueVal = 260; // 360 degrees total
    const hue = lang ? menu?.color || hueVal : hueVal;

    const primary_sat = "36%";
    const primary_lit = "30%";

    const secondary_sat = "30%";
    const secondary_lit = "48%";

    const light_sat = "43%";
    const light_lit = "96%";

    // Set the color scheme
    const primary = `hsl(${hue}, ${primary_sat}, ${primary_lit})`;
    const secondary = `hsl(${hue}, ${secondary_sat}, ${secondary_lit})`;
    const light = `hsl(${hue}, ${light_sat}, ${light_lit})`;

    const rootEl = document.documentElement;
    rootEl.style.setProperty("--primary", primary);
    rootEl.style.setProperty("--secondary", secondary);
    rootEl.style.setProperty("--light", light);
  }, [lang, menu]);
};
