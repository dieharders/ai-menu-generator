import Logo from "./Logo";
import styles from "./Banner.module.scss";

const Banner = ({title, logo}) => {
    const backgroundURL = "url(https://cdn.bhdw.net/im/sunrise-art-wallpaper-81329_w635.webp)";

    return <div className={styles.container} style={{"background-image": backgroundURL}}>
        <h1 className={styles.name}>{title}</h1>
        <Logo src={logo} />
    </div>;
};

export default Banner;
