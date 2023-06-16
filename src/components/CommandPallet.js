import iconPriceTag from '../assets/icons/icon-price-tag.svg';
import iconPrinter from '../assets/icons/icon-printer.svg';
import iconContract from '../assets/icons/icon-contract.svg';
import styles from "./CommandPallet.module.scss";

const CommandPallet = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const isOrder = queryParameters.get("order");
    const id = queryParameters.get("id");

    return (
        <div className={styles.container}>
            <a href={`${window.location.origin}/?id=${id}&order=${!isOrder}`} className={styles.iconContainer}>
                <img src={iconPriceTag} className={styles.icon} />
                <p className={styles.title}>Order</p>
            </a>
            <a href={`${window.location.origin}/?id=${id}&print=true`} className={styles.iconContainer}>
                <img src={iconPrinter} className={styles.icon} />
                <p className={styles.title}>Print Version</p>
            </a>
            <div className={styles.iconContainer}>
                <img src={iconContract} className={styles.icon} />
                <p className={styles.title}>Website</p>
            </div>
        </div>
    )
};

export default CommandPallet;
