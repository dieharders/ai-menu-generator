import { useEffect, useState } from 'react';
// import iconPriceTag from '../assets/icons/icon-price-tag.svg';
import iconPrinter from '../assets/icons/icon-printer.svg';
import iconContract from '../assets/icons/icon-contract.svg';
import styles from "./CommandPallet.module.scss";

const CommandPallet = ({ website }) => {
    const printParams = new URLSearchParams(window.location.search);
    const [printUrl, setPrintUrl] = useState();
    // const orderParams = new URLSearchParams(window.location.search);
    // const [orderUrl, setOrderUrl] = useState();

    useEffect(() => {
        printParams.set("print", true);
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
            {website && (
                <a href={website} className={[styles.iconContainer, styles.link].join(' ')}>
                    <img src={iconContract} className={styles.icon} />
                    <p className={styles.title}>Website</p>
                </a>
            )}
        </div>
    )
};

export default CommandPallet;
