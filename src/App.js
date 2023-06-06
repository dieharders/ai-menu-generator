import { useEffect } from 'react';
import Logo from "./components/Logo";
import Mains from "./components/Mains";
import Extras from "./components/Extras";
import Total from "./components/Total";
import QRLink from "./components/QRLink";
import WebLinks from "./components/WebLinks";
import Home from "./components/Home";
import { Provider } from "./Context";
import companies from "./data.json";
import styles from "./App.module.scss";

export default function App() {
  const isOrderMenuVariant = false; // Whether this should track orders
  // const {origin} = window.document.location;
  const origin = 'https://image-menu.vercel.app';
  const queryParameters = new URLSearchParams(window.location.search);
  const companyId = queryParameters.get("id");
  const link = `${origin}/?id=${companyId}`;
  const company = companies.find(item => item.companyId === companyId);

  const renderMenuItems = (data, Component) => {
    if (!data) return;
    const sections = Object.entries(data).map(([key, val]) => {
      return <Component key={key} items={val} sectionName={key} hasOrderInput={isOrderMenuVariant} />;
    });
    return <>{sections}</>;
  };

  const renderMenu = (
    <div className={styles.menu}>
      <h2 className={styles.name}>{company?.companyName}</h2>
      <div className={styles.topBanner}>
        <div className={styles.links}>
          <QRLink link={link}/>
          <WebLinks link={link} />
        </div>
        <Logo src={company?.logo} />
      </div>
      {renderMenuItems(company?.mains, Mains)}
      <aside className={styles.aside}>
        {renderMenuItems(company?.sides, Extras)}
        {renderMenuItems(company?.drinks, Extras)}
      </aside>
      <Total hasOrderInput={isOrderMenuVariant} />
    </div>
  );

  useEffect(() => {
    if (!company?.colors) return;

    // Get color scheme from company data
    const { primary, secondary, light } = company.colors;
    // Set the color scheme
    const rootEl = document.documentElement;
    rootEl.style.setProperty('--primary', primary);
    rootEl.style.setProperty('--secondary', secondary);
    rootEl.style.setProperty('--light', light);
  }, [company]);

  return (
    <Provider>
      {companyId ? renderMenu : <Home />}
    </Provider>
  );
}
