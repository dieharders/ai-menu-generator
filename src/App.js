import Logo from "./components/Logo";
import Mains from "./components/Mains";
import Extras from "./components/Extras";
import Total from "./components/Total";
import QRLink from "./components/QRLink";
import WebLinks from "./components/WebLinks";
import { Provider } from "./Context";
import companies from "./data.json";
import styles from "./App.module.scss";

export default function App() {
  const { mains, sides, drinks } = companies;
  /* This should be a shortlink */
  const {origin } = window.document.location;
  const queryParameters = new URLSearchParams(window.location.search);
  const companyId = queryParameters.get("id") || '0';
  const link = `${origin}/?id=${companyId}`;

  return (
    <Provider>
      <div className={styles.menu}>
        <div className={styles.topBanner}>
          <div>
            <QRLink link={link}/>
            <WebLinks link={link} />
          </div>
          <Logo />
        </div>
        <Mains meals={mains} />
        <aside className={styles.aside}>
          <Extras type="Sides" items={sides} />
          <Extras type="Drinks" items={drinks} />
        </aside>
        <Total />
      </div>
    </Provider>
  );
}
