import MenuSection from "./MenuSectionForWeb";
import Total from "./Total";
import CommandPallet from "./CommandPallet";
import Banner from "./Banner";
import { renderSections } from "../helpers/render";
import styles from "./MenuPageForWeb.module.scss";

const MenuPageForWeb = ({ data, languages }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const isOrderMenuVariant = queryParameters.get("order"); // Whether this should track orders
    const renderSection = ({key, val}) => {
      return <MenuSection key={key} items={val} sectionName={key} hasOrderInput={isOrderMenuVariant} />;
    };

    return (
      <>
        <div className={styles.bannerPage}>
          <Banner title={data?.companyName} backgroundURL={data?.bannerImage}>
            <CommandPallet data={data} languages={languages} />
          </Banner>
        </div>
        <div className={styles.page}>
          {renderSections(data?.menu, renderSection)}
          <Total hasOrderInput={isOrderMenuVariant} />
        </div>
      </>
    );
}

export default MenuPageForWeb;
