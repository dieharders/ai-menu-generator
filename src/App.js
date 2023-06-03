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
  return (
    <Provider>
      <div className={styles.menu}>
        <div className={styles.topBanner}>
          <QRLink />
          <Logo />
          <WebLinks />
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
