import MenuSection from "./MenuSection";
import Total from "./Total";
import CommandPallet from "./CommandPallet";
import Banner from "./Banner";
import styles from "./MenuPage.module.scss";

const MenuPageForWeb = ({ data }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const isPrint = queryParameters.get("print");
    const isOrderMenuVariant = queryParameters.get("order"); // Whether this should track orders

    const renderMenuItems = (items) => {
        if (!items) return;
        const sections = Object.entries(items)?.map(([key, val]) => {
          return <MenuSection key={key} items={val} sectionName={key} hasOrderInput={isOrderMenuVariant} />;
        });
        return <>{sections}</>;
    };

    return (
      <div className={styles.page}>
        <Banner title={data?.companyName} />
        <CommandPallet />
        {renderMenuItems(data?.menu)}
        <Total hasOrderInput={isOrderMenuVariant} />
      </div>
    );
}

export default MenuPageForWeb;
