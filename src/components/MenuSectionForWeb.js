import { useState } from "react";
import Input from "./Input";
import styles from "./MenuSectionForWeb.module.scss";

const MenuSectionForWeb = ({ items, sectionName, hasOrderInput }) => {
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

  return (
    <section>
      {/* Section heading */}
      <h2 className={styles.heading}>{sectionName}</h2>
      {/* Sections */}
      <div className={styles.itemsContainer}>
        {items?.map?.((meal, index) => {
          const [currentDetail, setCurrentDetail] = useState("ingredients");

          return (
            <article className={styles.articleContainer} key={meal.id}>
              <div className={styles.mainContainer}>
                {/* Main Details */}
                <div className={styles.textContainer}>
                  {/* Name */}
                  <h3 className={styles.name}>{meal.name}</h3>
                  {/* Description */}
                  <p className={styles.description}>{meal.description}</p>
                  {/* Price */}
                  <strong className={styles.price}>
                    {getCurrencyChar(meal.currency)}
                    {meal.price}
                  </strong>
                  {/* Buy/Remove order buttons */}
                  {hasOrder && (
                    <Input type={sectionName} name={meal.name} index={index} />
                  )}
                </div>
                {/* Photo */}
                <div className={styles.imageContainer}>
                  <img
                    className={styles.photo}
                    src={
                      meal.imageSource ||
                      require(`../assets/images/placeholder.png`)
                    }
                    alt={`${meal.category} - ${meal.name}`}
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
                      <h3 className={styles.name}>Category</h3>
                    </button>
                    <button
                      className={styles.detailButton}
                      onClick={() => setCurrentDetail("ingredients")}
                    >
                      <h3 className={styles.name}>Ingredients</h3>
                    </button>
                    <button
                      className={styles.detailButton}
                      onClick={() => setCurrentDetail("health")}
                    >
                      <h3 className={styles.name}>Health</h3>
                    </button>
                    <button
                      className={styles.detailButton}
                      onClick={() => setCurrentDetail("allergy")}
                    >
                      <h3 className={styles.name}>Allergy</h3>
                    </button>
                  </div>
                  {/* Category */}
                  <p
                    style={{ marginTop: "2rem" }}
                    className={styles.description}
                  >
                    {meal[currentDetail]}
                  </p>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MenuSectionForWeb;
