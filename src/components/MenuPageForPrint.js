import MenuSection from "./MenuSectionForPrint";
import Total from "./Total";
import Banner from "./Banner";
import Footer from "./Footer";
import { renderSections } from "../helpers/render";
import { getLanguageLabel } from "../helpers/languageCodes";
import { getImagesData } from "../helpers/getData";
import styles from "./MenuPageForPrint.module.scss";

const MenuPageForPrint = ({ data }) => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const isEnglishVersion = lang === "en" || !lang;
  const languageLabel = getLanguageLabel(lang);

  const renderSection = (section) => {
    return (
      <MenuSection
        key={section?.id}
        items={section?.items}
        sectionName={section?.name}
      />
    );
  };

  return (
    <>
      <div className={styles.bannerPage}>
        <Banner title={data?.name} backgroundURL={getImagesData()?.imageSource}>
          {!isEnglishVersion && (
            <h2 className={styles.language}>({languageLabel} version)</h2>
          )}
        </Banner>
      </div>
      <div className={styles.page}>
        {renderSections(data, renderSection)}
        <Footer data={data} />
        <Total hasOrderInput={false} />
      </div>
    </>
  );
};

export default MenuPageForPrint;
