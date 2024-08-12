import { getImagesData } from "../helpers/getData";
import styles from "./MenuSectionForPrint.module.scss";
import placeholder from "../assets/images/placeholder.png";

const MenuSectionForPrint = ({ items, sectionName }) => {
  return (
    <section>
      {/* Section heading */}
      <h2 className={styles.heading}>{sectionName}</h2>
      {/* Sections */}
      <div className={styles.itemsContainer}>
        {items?.map((item, index) => (
          <article className={styles.container} key={index}>
            <div className={styles.textContainer}>
              {/* Name */}
              <h3 className={styles.name}>{item.name}</h3>
              {/* Description */}
              <p className={styles.description}>{item.description}</p>
              {/* Price */}
              <strong className={styles.price}>${item.price}</strong>
            </div>
            {/* Photo */}
            <div className={styles.imageContainer}>
              <img
                className={styles.photo}
                src={getImagesData?.(item.id)?.imageSource || placeholder}
                alt={`${item.category} - ${item.name}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MenuSectionForPrint;
