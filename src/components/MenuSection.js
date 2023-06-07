import Input from "./Input";
import styles from "./MenuSection.module.scss";

const MenuSection = ({ items, sectionName, hasOrderInput }) => {
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
              {/* Buy/Remove order buttons */}
              {hasOrderInput && (
                <Input type={sectionName} name={meal.name} index={index} />
              )}
            </div>
            {/* Photo */}
            <div className={styles.imageContainer}>
              <img
                className={styles.photo}
                src={`${process.env.PUBLIC_URL}/images/${meal.image}`}
                alt={`${meal.category} - ${meal.name}`}
              />
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}

export default MenuSection;
