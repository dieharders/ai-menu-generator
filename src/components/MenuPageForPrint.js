import MenuSection from "./MenuSection";
import Total from "./Total";
import Banner from "./Banner";
import Footer from "./Footer";
import styles from "./MenuPage.module.scss";

const MenuPageForPrint = ({ data }) => {
    const renderMenuItems = (items) => {
        if (!items) return;
        const sections = Object.entries(items)?.map(([key, val]) => {
          return <MenuSection key={key} items={val} sectionName={key} hasOrderInput={false} />;
        });
        return <>{sections}</>;
    };

    return (
      <div className={styles.page}>
        <Banner title={data?.companyName} />
        {renderMenuItems(data?.menu)}
        <Footer data={data} />
        <Total hasOrderInput={false} />
      </div>
    );
}

export default MenuPageForPrint;
