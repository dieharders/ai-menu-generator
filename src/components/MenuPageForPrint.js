import MenuSection from "./MenuSectionForPrint";
import Total from "./Total";
import Banner from "./Banner";
import Footer from "./Footer";
import { renderSections } from "../helpers/render";
import styles from "./MenuPageForPrint.module.scss";

const MenuPageForPrint = ({ data }) => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    const isEnglishVersion = lang === "en" || !lang;
    const renderSection = ({key, val}) => {
      return <MenuSection key={key} items={val} sectionName={key} />;
    };

    return (
      <>
        <div className={styles.bannerPage}>
          <Banner title={data?.companyName} backgroundURL={data?.bannerImage}>
            {!isEnglishVersion && <h2 className={styles.language}>({lang} version)</h2>}
          </Banner>
        </div>
        <div className={styles.page}>
          {renderSections(data?.menu, renderSection)}
          <Footer data={data} />
          <Total hasOrderInput={false} />
        </div>
      </>
    );
}

export default MenuPageForPrint;
