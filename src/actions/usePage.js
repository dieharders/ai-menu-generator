import { useRef, useEffect, useMemo, useContext } from "react";
import { Context } from "../Context";
import translate from "../helpers/translateMenu";
import { StorageAPI } from "../helpers/storage";
import { languageCodes } from "../helpers/languageCodes";
import { SAVED_MENU_ID } from "../components/Generate";
import cachedMenus from "../data.json"; // cached menu data

/**
 * Sets up a page.
 */
export const usePage = () => {
  const { setMenuData, setMenuId } = useContext(Context);
  const queryParameters = new URLSearchParams(window.location.search);
  const menuId = queryParameters.get("id");
  const menus = useMemo(() => {
    // Determine if we should read from localStorage or from included data.json
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
  }, [lang, language, menu, menus, setMenuData]);

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
