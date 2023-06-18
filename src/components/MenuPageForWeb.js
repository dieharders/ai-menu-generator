import MenuSection from "./MenuSectionForWeb";
import Total from "./Total";
import CommandPallet from "./CommandPallet";
import Banner from "./Banner";
import { renderSections } from "../helpers/render";
import styles from "./MenuPageForWeb.module.scss";

const MenuPageForWeb = ({ data }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const isOrderMenuVariant = queryParameters.get("order"); // Whether this should track orders
    const renderSection = ({key, val}) => {
      return <MenuSection key={key} items={val} sectionName={key} hasOrderInput={isOrderMenuVariant} />;
    };

    return (
      <div className={styles.page}>
        <Banner title={data?.companyName} backgroundURL={data?.bannerImage} />
        <CommandPallet website={data?.website} />
        {renderSections(data?.menu, renderSection)}
        <Total hasOrderInput={isOrderMenuVariant} />
      </div>
    );
}

export default MenuPageForWeb;
