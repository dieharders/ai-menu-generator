import { useEffect } from 'react';
import { Provider } from "./Context";
import Home from "./components/Home";
import MenuPageForWeb from "./components/MenuPageForWeb";
import MenuPageForPrint from './components/MenuPageForPrint';
import companies from "./data.json";
import styles from "./App.module.scss";

export default function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const companyId = queryParameters.get("id");
  const isPrint = queryParameters.get("print");
  const company = companies?.find(item => item.companyId === companyId);

  useEffect(() => {
    if (!company?.color) return;

    // Get color scheme from company data
    const hue = company?.color;

    const primary_sat = '33%';
    const primary_lit = '24%';

    const secondary_sat = '30%';
    const secondary_lit = '34%';

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
      {companyId && isPrint && <MenuPageForPrint data={company} />}
      {companyId && !isPrint && <MenuPageForWeb data={company} />}
      {!companyId && <Home />}
    </Provider>
  );
}
