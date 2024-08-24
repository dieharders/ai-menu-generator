import { useEffect, useContext } from "react";
import { Context } from "../Context";
import { usePage } from "../actions/usePage";
import Total from "./Total";
import CommandPallet from "./CommandPallet";
import Banner from "./Banner";
import { MenuItem } from "./MenuItem";
import { useImagesData } from "../helpers/getData";
import { languageCodes } from "../helpers/languageCodes";
import placeholder from "../assets/images/placeholder.png";
import styles from "./MenuPage.module.scss";

const queryParameters = new URLSearchParams(window.location.search);

export const MenuPage = () => {
  const { menuData } = useContext(Context);
  usePage();
  const imgData = useImagesData();
  const bannerSrc = imgData?.imageSource?.startsWith?.("data:image/")
    ? imgData?.imageSource
    : imgData
    ? `images/${imgData?.imageSource}`
    : "";

  const Section = ({ data }) => {
    return (
      <section>
        {/* Section heading */}
        <h2 className={styles.heading}>{data?.name}</h2>
        {/* Items */}
        <div className={styles.itemsContainer}>
          {data?.items?.map?.((item) => {
            // Menu Item
            return <MenuItem key={item.id} item={item} />;
          })}
        </div>
      </section>
    );
  };

  const renderSections = (data) => {
    if (!data || data.items?.length === 0) return;
    return data.sectionNames?.map((name, index) => {
      const items = data.items?.filter((item) => name === item.sectionName);
      const section = {
        id: `${index}`,
        items,
        name,
      };
      return <Section key={section.id} data={section} />;
    });
  };

  useEffect(() => {
    const lang = queryParameters.get("lang");
    const hasLang = languageCodes?.[lang];

    if (menuData && !hasLang) {
      queryParameters.set("lang", "en");
      const query = queryParameters.toString();
      // Set url param if no language specified
      window.history.replaceState(null, null, query);
    }
  }, [menuData]);

  return (
    <>
      {/* Top banner */}
      <div className={styles.bannerPage}>
        <Banner
          title={menuData?.name}
          description={`${menuData?.description} ${
            menuData?.imageDescription ? menuData?.imageDescription : ""
          }`}
          type={menuData?.type}
          category={menuData?.category}
          contact={menuData?.contact}
          location={menuData?.location}
          cost={menuData?.cost}
          backgroundURL={bannerSrc || placeholder}
          menuSourceImage={menuData?.menuSourceImage}
        >
          <CommandPallet data={menuData} />
        </Banner>
      </div>
      {/* Main body */}
      <div className={styles.page}>
        {renderSections(menuData)}
        <Total />
      </div>
    </>
  );
};
