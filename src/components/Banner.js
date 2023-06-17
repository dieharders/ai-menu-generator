import styles from "./Banner.module.scss";

const Banner = ({title}) => {
    const backgroundURL = "url(https://cdn.bhdw.net/im/sunrise-art-wallpaper-81329_w635.webp)";

    return <div className={styles.container} style={{"backgroundImage": backgroundURL}}>
        <h1 className={styles.name}>{title}</h1>
    </div>;
};

export default Banner;
