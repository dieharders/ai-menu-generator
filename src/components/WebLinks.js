import styles from './WebLinks.module.scss';

const WebLinks = ({link}) => {
    return <div className={styles.container}>
        <a href={link} className={styles.linkText}>{link}</a>
    </div>
};

export default WebLinks;