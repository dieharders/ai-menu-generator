import styles from "./Banner.module.scss";

const Banner = ({ title, backgroundURL }) => {
    const companyBg = require(`../assets/banners/${backgroundURL}`);
    const defaultImage = 'https://cdn.bhdw.net/im/sunrise-art-wallpaper-81329_w635.webp';
    const path = backgroundURL?.length > 0 ? companyBg : defaultImage;
    const url = `url(${path})`;

    return <div className={styles.container} style={{"backgroundImage": url}}>
        <h1 className={styles.name}>{title}</h1>
    </div>;
};

export default Banner;
