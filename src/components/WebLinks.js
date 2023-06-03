import styles from './WebLinks.module.scss';

const companyId = '0';

const WebLinks = () => {
    return <div className={styles.container}>
        {/* This should be a shortlink */}
        <a href={`https://www.menu.bee/?id=${companyId}`}>{`https://menu.bee/?id=${companyId}`}</a>
    </div>
};

export default WebLinks;