import { useEffect, useState } from 'react';
// import iconPriceTag from '../assets/icons/icon-price-tag.svg';
import SelectLanguage from "./SelectLanguage";
import iconPrinter from '../assets/icons/icon-print.svg';
import iconLanguage from '../assets/icons/icon-lang.svg';
import iconSearch from '../assets/icons/icon-search.svg';
import iconWebsite from '../assets/icons/icon-website.svg';
import styles from "./CommandPallet.module.scss";

const CommandPallet = ({ website }) => {
    const printParams = new URLSearchParams(window.location.search);
    const [printUrl, setPrintUrl] = useState();
    // const orderParams = new URLSearchParams(window.location.search);
    // const [orderUrl, setOrderUrl] = useState();

    useEffect(() => {
        const lang = printParams.get("lang");
        printParams.set("print", true);
        if (lang === "undefined") printParams.set("lang", "en");
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
                <img src={iconPrinter} className={styles.icon} />
                <p className={styles.title}>Print Version</p>
            </a>
            <div className={styles.iconContainer}>
                <img src={iconLanguage} className={styles.icon} />
                <SelectLanguage />
            </div>
            <a href={window.location.origin} className={styles.iconContainer}>
                <img src={iconSearch} className={styles.icon} />
                <p className={styles.title}>Search</p>
            </a>
            {website && (
                <a href={website} className={[styles.iconContainer, styles.link].join(' ')}>
                    <img src={iconWebsite} className={styles.icon} />
                    <p className={styles.title}>Website</p>
                </a>
            )}
        </div>
    )
};

export default CommandPallet;
