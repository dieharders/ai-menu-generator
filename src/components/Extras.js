import Input from "./Input";
import styles from "../App.module.scss";

export default function Extras({ type, items, hasOrderInput }) {
  return (
    <section className={styles.extras}>
      <h2 className={styles.extrasHeading}>{type}</h2>
      {items.map((item, index) => (
        <article className={styles.menuItem} key={index}>
          <div className={styles.extrasName}>{item.name}</div>
          <strong>${item.price}</strong>
          {hasOrderInput && (
            <Input type={type} name={item.name} index={index} />
          )}
          <div className={styles.extrasImageContainer}>
            <img
              className={styles.extrasImage}
              src={process.env.PUBLIC_URL + '/images/' + item.image}
              alt={`${item.category} - ${item.name}`}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
