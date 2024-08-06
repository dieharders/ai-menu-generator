import { useEffect } from "react";
import MenuSection from "./MenuSectionForWeb";
import Total from "./Total";
import CommandPallet from "./CommandPallet";
import Banner from "./Banner";
import { renderSections } from "../helpers/render";
import languageCodes from "../helpers/languageCodes";
import styles from "./MenuPageForWeb.module.scss";

const MenuPageForWeb = ({ data, languages }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const isOrderMenuVariant = queryParameters.get("order"); // Whether this should track orders
  const renderSection = ({ section }) => {
    return (
      <MenuSection
        key={section?.id}
        items={section?.items}
        sectionName={section?.name}
        hasOrderInput={isOrderMenuVariant}
      />
    );
  };

  useEffect(() => {
    const lang = queryParameters.get("lang");
    const hasLang = languageCodes?.[lang];

    if (data && !hasLang) {
      queryParameters.set("lang", "en");
      const query = queryParameters.toString();
      // Set url param if no language specified
      window.history.replaceState(null, null, query);
    }
  }, [data]);

  return (
    <>
      <div className={styles.bannerPage}>
        <Banner
          title={data?.menu?.name}
          backgroundURL={data?.menu?.bannerImageSource}
        >
          <CommandPallet data={data} languages={languages} />
        </Banner>
      </div>
      <div className={styles.page}>
        {renderSections(data, renderSection)}
        <Total hasOrderInput={isOrderMenuVariant} />
      </div>
    </>
  );
};

export default MenuPageForWeb;
