import { useEffect, useRef, useState } from 'react';
import { Provider } from "./Context";
import Home from "./components/Home";
import MenuPageForWeb from "./components/MenuPageForWeb";
import MenuPageForPrint from './components/MenuPageForPrint';
import companies from "./data.json";
import Background from "./components/BackgroundSVG";
import translate from "./helpers/translateMenu";
import styles from "./App.module.scss";

export default function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const companyId = queryParameters.get("id");
  const lang = queryParameters.get("lang");
  const language = lang === "undefined" ? "en" : lang;
  const isPrint = queryParameters.get("print") === 'true';
  const company = companies?.find(item => item.companyId === companyId);
  const [data, setData] = useState(null);
  const selectedLang = useRef(null);
  // Read available translations
  const languages = company ? Object.keys(company?.menu) : [];

  useEffect(() => {
    // Set menu data
    if (data || selectedLang.current === language || !company) return;
    setData(translate(company, language));
    selectedLang.current = language;
  }, []);
  
  useEffect(() => {
    if (!company?.color) return;

    // Get color scheme from company data
    const hue = company?.color;

    const primary_sat = '36%';
    const primary_lit = '30%';

    const secondary_sat = '33%';
    const secondary_lit = '36%';

    const light_sat = '43%';
    const light_lit = '96%';

    // Set the color scheme
    const primary = `hsl(${hue}, ${primary_sat}, ${primary_lit})`;
    const secondary = `hsl(${hue}, ${secondary_sat}, ${secondary_lit})`;
    const light = `hsl(${hue}, ${light_sat}, ${light_lit})`;

    const rootEl = document.documentElement;
    rootEl.style.setProperty('--primary', primary);
    rootEl.style.setProperty('--secondary', secondary);
    rootEl.style.setProperty('--light', light);
  }, [company]);

  return (
    <Provider className={styles}>
      <Background />
      {companyId && isPrint && <MenuPageForPrint data={data} />}
      {companyId && !isPrint && <MenuPageForWeb data={data} languages={languages} />}
      {!companyId && <Home />}
    </Provider>
  );
}
