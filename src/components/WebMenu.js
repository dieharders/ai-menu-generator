import Mains from "./Mains";
import Extras from "./Extras";
import Total from "./Total";
import Banner from "./Banner";
import Footer from "./Footer";
import styles from "../App.module.scss";

const WebMenu = ({ data }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const isOrderMenuVariant = queryParameters.get("order"); // Whether this should track orders

    const renderMenuItems = (items, Component) => {
        if (!items) return;
        const sections = Object.entries(items).map(([key, val]) => {
          return <Component key={key} items={val} sectionName={key} hasOrderInput={isOrderMenuVariant} />;
        });
        return <>{sections}</>;
    };

    return (
        <div className={styles.menu}>
          <Banner title={data?.companyName} logo={data?.logo}/>
          {renderMenuItems(data?.mains, Mains)}
          <aside className={styles.aside}>
            {renderMenuItems(data?.sides, Extras)}
            {renderMenuItems(data?.drinks, Extras)}
          </aside>
          <Footer data={data} />
          <Total hasOrderInput={isOrderMenuVariant} />
        </div>
    );
}

export default WebMenu;
