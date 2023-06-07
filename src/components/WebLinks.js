import styles from './WebLinks.module.scss';

const WebLinks = ({link}) => {
    return <div className={styles.container}>
        <h3 className={styles.description}>Follow link to access the interactive menu</h3>
        <a href={link} className={styles.linkText}>{link}</a>
    </div>
};

export default WebLinks;