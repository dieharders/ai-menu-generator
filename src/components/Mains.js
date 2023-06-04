import Input from "./Input";
import styles from "../App.module.scss";

export default function Mains({ meals, hasOrderInput }) {
  return (
    <section className={styles.mains}>
      {meals.map((meal, index) => (
        <article className={styles.menuItem} key={index}>
          <h3 className={styles.mainsName}>{meal.name}</h3>
          <strong>${meal.price}</strong>
          {hasOrderInput && (
            <Input type="mains" name={meal.name} index={index} />
          )}
          <div className={styles.mainsImageContainer}>
            <img
              className={styles.mainsImage}
              src={process.env.PUBLIC_URL + '/images/' + meal.image}
              alt={`${meal.category} - ${meal.name}`}
            />
          </div>
          <p className={styles.mainsDescription}>{meal.description}</p>
        </article>
      ))}
    </section>
  );
}
