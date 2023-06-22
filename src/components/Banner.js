import styles from "./Banner.module.scss";

const Banner = ({ title, backgroundURL, children }) => {
    const defaultImage = 'https://cdn.bhdw.net/im/sunrise-art-wallpaper-81329_w635.webp';
    const path = backgroundURL?.length > 0 ? require(`../assets/banners/${backgroundURL}`) : defaultImage;
    const url = `url(${path})`;

    return (
        <div className={styles.page}>
            <div className={styles.container} style={{backgroundImage: url}}>
                <h1 className={styles.name}>{title}</h1>
            </div>
            {children}
        </div>
    );
};

export default Banner;
