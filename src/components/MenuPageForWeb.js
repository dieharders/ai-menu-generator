import { useEffect, useContext, useState } from "react";
import { Context } from "../Context";
import { usePage } from "../actions/usePage";
import { searchImagesAction } from "../actions/tools";
import MenuSection from "./MenuSectionForWeb";
import Total from "./Total";
import CommandPallet from "./CommandPallet";
import Banner from "./Banner";
import { renderSections } from "../helpers/render";
import { getImagesData } from "../helpers/getData";
import { languageCodes } from "../helpers/languageCodes";
import placeholder from "../assets/images/placeholder.png";
import styles from "./MenuPageForWeb.module.scss";

const queryParameters = new URLSearchParams(window.location.search);

const MenuPageForWeb = () => {
  const { menuData: data } = useContext(Context);
  usePage();
  const isOrderMenuVariant = queryParameters.get("order"); // Whether this should track orders
  const [defaultImages, setDefaultImages] = useState([]);

  const renderSection = (section) => {
    return (
      <MenuSection
        key={section?.id}
        items={section?.items}
        // Pass defaultImages to children to use in place of empty "imageSource"
        defaultImages={defaultImages}
        sectionName={section?.name}
        hasOrderInput={isOrderMenuVariant}
      />
    );
  };

  const createItemRequests = (items) => {
    return items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      category: i.category,
    }));
  };

  // @TODO We should do this during menu generation and cache images in LocalStorage
  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      // Fetch some default images from google
      const action = async () => {
        const results = await searchImagesAction(
          createItemRequests(data.items)
        );

        if (results && results.length > 0) setDefaultImages(results);
      };
      if (!window.location.hostname.includes("localhost")) action();
    }
  }, [data]);

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
      {/* Top banner */}
      <div className={styles.bannerPage}>
        <Banner
          title={data?.name}
          description={data?.description}
          type={data?.type}
          category={data?.category}
          contact={data?.contact}
          location={data?.location}
          cost={data?.cost}
          backgroundURL={getImagesData()?.imageSource || placeholder}
        >
          <CommandPallet data={data} />
        </Banner>
      </div>
      {/* Main body */}
      <div className={styles.page}>
        {renderSections(data, renderSection)}
        <Total hasOrderInput={isOrderMenuVariant} />
      </div>
    </>
  );
};

export default MenuPageForWeb;
