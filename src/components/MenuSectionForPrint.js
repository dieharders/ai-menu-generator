import styles from "./MenuSectionForPrint.module.scss";

const MenuSectionForPrint = ({ items, sectionName }) => {
  return (
    <section>
      {/* Section heading */}
      <h2 className={styles.heading}>{sectionName}</h2>
      {/* Sections */}
      <div className={styles.itemsContainer}>
        {items?.map((meal, index) => (
          <article className={styles.container} key={index}>
            <div className={styles.textContainer}>
              {/* Name */}
              <h3 className={styles.name}>{meal.name}</h3>
              {/* Description */}
              <p className={styles.description}>{meal.description}</p>
              {/* Price */}
              <strong className={styles.price}>${meal.price}</strong>
            </div>
            {/* Photo */}
            <div className={styles.imageContainer}>
              <img
                className={styles.photo}
                src={require(`../assets/images/${meal.image}`)}
                alt={`${meal.category} - ${meal.name}`}
              />
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}

export default MenuSectionForPrint;
