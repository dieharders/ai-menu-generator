import MenuSection from "./MenuSectionForPrint";
import Total from "./Total";
import Banner from "./Banner";
import Footer from "./Footer";
import { renderSections } from "../helpers/render";
import styles from "./MenuPageForPrint.module.scss";

const MenuPageForPrint = ({ data }) => {
    const renderSection = ({key, val}) => {
      return <MenuSection key={key} items={val} sectionName={key} />;
    };

    return (
      <div className={styles.page}>
        <Banner title={data?.companyName} />
        {renderSections(data?.menu, renderSection)}
        <Footer data={data} />
        <Total hasOrderInput={false} />
      </div>
    );
}

export default MenuPageForPrint;
