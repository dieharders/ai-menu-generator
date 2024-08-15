import { useState } from "react";
import Input from "./Input";
import { keys, translate } from "../helpers/appTranslations";
import { getImagesData } from "../helpers/getData";
import placeholder from "../assets/images/placeholder.png";
import styles from "./MenuSectionForWeb.module.scss";

export const MenuSection = ({ item, index, sectionName, hasOrderInput }) => {
  const hasOrder = hasOrderInput === "true";
  const getCurrencyChar = (type) => {
    switch (type) {
      case "ESP":
      case "EUR":
        return "€";
      case "YEN":
      case "JPY":
        return "￥";
      case "KRW":
        return "₩";
      case "RUB":
        return "₽";
      case "RMB":
        return "¥";
      case "USD":
        return "$";
      default:
        return "$";
    }
  };
  const [currentDetail, setCurrentDetail] = useState("ingredients");

  return (
    <article className={styles.articleContainer} key={item.id}>
      <div className={styles.mainContainer}>
        {/* Main Details */}
        <div className={styles.textContainer}>
          {/* Name */}
          <h3 className={styles.name}>{item.name}</h3>
          {/* Price */}
          <strong className={styles.price}>
            {getCurrencyChar(item.currency)}
            {item.price}
          </strong>
          {/* Description */}
          <p className={styles.description}>{item.description}</p>
          {/* Buy/Remove order buttons */}
          {hasOrder && (
            <Input type={sectionName} name={item.name} index={index} />
          )}
        </div>
        {/* Photo */}
        <div className={styles.imageContainer}>
          <img
            title={item.imageDescription}
            className={styles.photo}
            src={getImagesData(item.id)?.imageSource || placeholder}
            alt={`${item.category} - ${item.name}`}
          />
        </div>
      </div>
      {/* Extra Details */}
      <div className={styles.detailsContainer}>
        <span style={{ width: "100%" }}>
          {/* Detail Name */}
          <div className={styles.detailNamesContainer}>
            <button
              className={styles.detailButton}
              onClick={() => setCurrentDetail("category")}
            >
              <h3 className={styles.name}>{translate(keys.CATEGORY)}</h3>
            </button>
            <button
              className={styles.detailButton}
              onClick={() => setCurrentDetail("ingredients")}
            >
              <h3 className={styles.name}>{translate(keys.INGREDIENTS)}</h3>
            </button>
            <button
              className={styles.detailButton}
              onClick={() => setCurrentDetail("health")}
            >
              <h3 className={styles.name}>{translate(keys.HEALTH)}</h3>
            </button>
            <button
              className={styles.detailButton}
              onClick={() => setCurrentDetail("allergy")}
            >
              <h3 className={styles.name}>{translate(keys.ALLERGY)}</h3>
            </button>
          </div>
          {/* Selected detail description */}
          <p
            style={{ marginTop: "2rem", marginBottom: "1rem" }}
            className={styles.description}
          >
            {item[currentDetail]}
          </p>
        </span>
      </div>
    </article>
  );
};
