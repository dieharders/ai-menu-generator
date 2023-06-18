import styles from "./Banner.module.scss";

const Banner = ({ title, backgroundURL }) => {
    // Temp background image. Maybe use AI to generate unique for each company?
    const url = `url(${backgroundURL})`;

    return <div className={styles.container} style={{"backgroundImage": url}}>
        <h1 className={styles.name}>{title}</h1>
    </div>;
};

export default Banner;
