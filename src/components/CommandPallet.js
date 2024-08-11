import { useEffect, useState } from "react";
// import iconPriceTag from '../assets/icons/icon-price-tag.svg';
import SelectLanguage from "./SelectLanguage";
import iconPrinter from "../assets/icons/icon-print.svg";
import iconLanguage from "../assets/icons/icon-lang.svg";
import iconSearch from "../assets/icons/icon-search.svg";
import iconWebsite from "../assets/icons/icon-website.svg";
import { languageCodes } from "../helpers/languageCodes";
import { keys, translate } from "../helpers/appTranslations";
import styles from "./CommandPallet.module.scss";

const CommandPallet = ({ data }) => {
  const [printUrl, setPrintUrl] = useState();
  // const orderParams = new URLSearchParams(window.location.search);
  // const [orderUrl, setOrderUrl] = useState();
  const website = data?.website;

  useEffect(() => {
    const printParams = new URLSearchParams(window.location.search);
    const lang = printParams.get("lang");
    printParams.set("print", true);
    if (!languageCodes?.[lang]) printParams.set("lang", "en");
    const query = printParams.toString();
    setPrintUrl(`${window.location.origin}/?${query}`);
  }, []);

  // useEffect(() => {
  //     const orderValue = orderParams.get("order");
  //     orderParams.set("order", !orderValue);
  //     const query = orderParams.toString();
  //     setOrderUrl(`${window.location.origin}/?${query}`);
  // }, []);

  return (
    <div className={styles.container}>
      {/* <a href={orderUrl} className={styles.iconContainer}>
        <img src={iconPriceTag} className={styles.icon} />
        <p className={styles.title}>Order</p>
      </a> */}
      <a href={printUrl} className={styles.iconContainer}>
        <img alt="print" src={iconPrinter} className={styles.icon} />
        <p className={styles.title}>{translate(keys.PRINT_VERSION)}</p>
      </a>
      <div className={styles.iconContainer}>
        <img alt="language" src={iconLanguage} className={styles.icon} />
        <SelectLanguage />
      </div>
      <a href={window.location.origin} className={styles.iconContainer}>
        <img alt="search" src={iconSearch} className={styles.icon} />
        <p className={styles.title}>{translate(keys.SEARCH)}</p>
      </a>
      {website && (
        <a
          href={website}
          className={[styles.iconContainer, styles.link].join(" ")}
        >
          <img alt="website" src={iconWebsite} className={styles.icon} />
          <p className={styles.title}>{translate(keys.WEBSITE)}</p>
        </a>
      )}
    </div>
  );
};

export default CommandPallet;
