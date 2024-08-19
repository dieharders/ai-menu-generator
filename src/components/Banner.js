import { useState } from "react";
import { useImagesData } from "../helpers/getData";
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
  const hasImage = useImagesData()?.imageSource;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Background image */}
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${backgroundURL})` }}
        />
        {/* Gen buttons */}
        {hasImage ? (
          <button
            disabled={isButtonDisabled}
            className={styles.imageButton}
            onClick={() => {}}
          >
            🔽 Download image
          </button>
        ) : (
          <button
            disabled={isButtonDisabled}
            className={styles.imageButton}
            onClick={() => setIsButtonDisabled(true)}
          >
            ✨ Generate image
          </button>
        )}
        {/* Company details */}
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
      {/* Sub-menu of buttons */}
      {children}
    </div>
  );
};

export default Banner;
