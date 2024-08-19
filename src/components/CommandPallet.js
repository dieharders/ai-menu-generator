// import { useEffect, useState } from "react";
// import iconPriceTag from '../assets/icons/icon-price-tag.svg';
import SelectLanguage from "./SelectLanguage";
// import iconPrinter from "../assets/icons/icon-print.svg";
import iconLanguage from "../assets/icons/icon-lang.svg";
import iconHome from "../assets/icons/icon-home.svg";
import iconWebsite from "../assets/icons/icon-website.svg";
// import { languageCodes } from "../helpers/languageCodes";
import { keys, translate } from "../helpers/appTranslations";
import styles from "./CommandPallet.module.scss";

const CommandPallet = ({ data }) => {
  // const [printUrl, setPrintUrl] = useState();
  // const orderParams = new URLSearchParams(window.location.search);
  // const [orderUrl, setOrderUrl] = useState();
  const website = data?.website;

  // For print friendly functionality
  // useEffect(() => {
  //   const printParams = new URLSearchParams(window.location.search);
  //   const lang = printParams.get("lang");
  //   printParams.set("print", true);
  //   if (!languageCodes?.[lang]) printParams.set("lang", "en");
  //   const query = printParams.toString();
  //   setPrintUrl(`${window.location.origin}/?${query}`);
  // }, []);

  // For ordering UI
  // useEffect(() => {
  //     const orderValue = orderParams.get("order");
  //     orderParams.set("order", !orderValue);
  //     const query = orderParams.toString();
  //     setOrderUrl(`${window.location.origin}/?${query}`);
  // }, []);

  return (
    // Buttons
    <div className={styles.container}>
      {/* Go to shopping cart button */}
      {/* <a href={orderUrl} className={styles.iconContainer}>
        <img src={iconPriceTag} className={styles.icon} />
        <p className={styles.title}>Order</p>
      </a> */}
      {/* Printer friendly button */}
      {/* <a href={printUrl} className={styles.iconContainer}>
        <img alt="print" src={iconPrinter} className={styles.icon} />
        <p className={styles.title}>{translate(keys.PRINT_VERSION)}</p>
      </a> */}
      {/* Go home button */}
      <a href={window.location.origin} className={styles.iconContainer}>
        <img
          alt="home page"
          title="go home"
          src={iconHome}
          className={styles.icon}
        />
        <p className={styles.title}>Home</p>
      </a>
      {/* Set language button */}
      <div className={styles.iconContainer}>
        <img
          alt="language"
          title="set language"
          src={iconLanguage}
          className={styles.icon}
        />
        <SelectLanguage />
      </div>
      {/* Go to menu website button */}
      {website && (
        <a
          href={website}
          className={[styles.iconContainer, styles.link].join(" ")}
        >
          <img
            alt="website"
            title="go to menu website"
            src={iconWebsite}
            className={styles.icon}
          />
          <p className={styles.title}>{translate(keys.WEBSITE)}</p>
        </a>
      )}
    </div>
  );
};

export default CommandPallet;
