import styles from './BackgroundSVG.module.scss';

const BackgroundSVG = ({children}) => {
    return <div className={styles.background}>
        {children}
    </div>;
};

export default BackgroundSVG;
