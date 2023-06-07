import Input from "./Input";
import styles from "./MenuSection.module.scss";

const MenuSection = ({ items, sectionName, hasOrderInput }) => {
  return (
    <section>
      <h2 className={styles.heading}>{sectionName}</h2> 
      {items?.map((meal, index) => (
        <article className={styles.container} key={index}>
          <h3 className={styles.name}>{meal.name}</h3>
          <strong>${meal.price}</strong>
          {hasOrderInput && (
            <Input type={sectionName} name={meal.name} index={index} />
          )}
          <div className={styles.imageContainer}>
            <img
              className={styles.photo}
              src={process.env.PUBLIC_URL + '/images/' + meal.image}
              alt={`${meal.category} - ${meal.name}`}
            />
          </div>
          <p className={styles.description}>{meal.description}</p>
        </article>
      ))}
    </section>
  );
}

export default MenuSection;
