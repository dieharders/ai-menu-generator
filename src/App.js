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
  const { mains, sides, drinks } = companies;
  const isOrderMenuVariant = false;
  /* This should be a bit.ly shortlink */
  const {origin } = window.document.location;
  const queryParameters = new URLSearchParams(window.location.search);
  const companyId = queryParameters.get("id") || '-1';
  const link = `${origin}/?id=${companyId}`;

  const renderMenu = (
    <div className={styles.menu}>
    <div className={styles.topBanner}>
      <div className={styles.links}>
        <QRLink link={link}/>
        <WebLinks link={link} />
      </div>
      <Logo />
    </div>
    <Mains meals={mains} hasOrderInput={isOrderMenuVariant} />
    <aside className={styles.aside}>
      <Extras type="Sides" items={sides} hasOrderInput={isOrderMenuVariant} />
      <Extras type="Drinks" items={drinks} hasOrderInput={isOrderMenuVariant} />
    </aside>
    <Total hasOrderInput={isOrderMenuVariant} />
  </div>
  );

  return (
    <Provider>
      {companyId === '-1' ? <Home /> : renderMenu}
    </Provider>
  );
}
