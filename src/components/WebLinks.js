import styles from './WebLinks.module.scss';

const WebLinks = ({link}) => {
    return <div className={styles.container}>
        <p className={styles.companyTitle}>International Dish</p>
        <h3 className={styles.description}>Web version of menu</h3>
        <a href={link} className={styles.linkText}>{link}</a>
    </div>
};

export default WebLinks;