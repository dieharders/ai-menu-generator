import { useEffect, useRef, useState, useMemo } from "react";
import { Provider } from "./Context";
import Home from "./components/Home";
import MenuPageForWeb from "./components/MenuPageForWeb";
import MenuPageForPrint from "./components/MenuPageForPrint";
// import menus from "./data.json";
import { StorageAPI } from "./helpers/storage";
import Background from "./components/BackgroundSVG";
import translate from "./helpers/translateMenu";
import languageCodes from "./helpers/languageCodes";
import styles from "./App.module.scss";
import { SAVED_MENU_ID } from "./components/Generate";

export default function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const menuId = queryParameters.get("id");
  const lang = queryParameters.get("lang");
  const language = languageCodes?.[lang] ? lang : "en";
  const isPrint = queryParameters.get("print") === "true";
  const menus = useMemo(() => StorageAPI.getItem(SAVED_MENU_ID), []);
  const menu = menus?.find((m) => m.language === language);
  const [data, setData] = useState(null);
  const selectedLang = useRef(null);

  useEffect(() => {
    // Set menu data
    if (selectedLang.current === language || !menu) return;
    // Set translation data
    setData(translate({ data: menus, menu, lang }));
    selectedLang.current = language;
  }, [menu]);

  useEffect(() => {
    // Get color scheme from menu data
    const hueVal = 260; // 360 degrees total
    const hue = lang ? menu?.color || hueVal : hueVal;

    const primary_sat = "36%";
    const primary_lit = "30%";

    const secondary_sat = "33%";
    const secondary_lit = "36%";

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
  }, [menu]);

  return (
    <Provider className={styles}>
      <Background />
      {menuId && isPrint && <MenuPageForPrint data={data} />}
      {menuId && !isPrint && <MenuPageForWeb data={data} />}
      {!menuId && <Home />}
    </Provider>
  );
}
