import styles from "./Banner.module.scss";

const Banner = ({
  title,
  description,
  type,
  category,
  contact,
  location,
  cost,
  backgroundURL,
  children,
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${backgroundURL})` }}
        />
        <div className={styles.details}>
          <h1 className={styles.title}>{title || "Restaurant"}</h1>
          <span className={styles.detailSpan}>
            <b>{cost || "$"}</b>
            <b>{category || "restaurant"}</b>
            <b>{type}</b>
          </span>
          <span className={styles.detailSpan}>
            <b>{contact || "No contact"}</b>
            <b>{location || "No location"}</b>
          </span>
          <p className={styles.descr}>{description || "No description"}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Banner;
