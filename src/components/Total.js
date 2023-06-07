import { useContext } from "react";
import { Context } from "../Context";
import data from "../data";
import styles from "./Total.module.scss";

export default function Total({hasOrderInput}) {
  const [items] = useContext(Context);

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    const amount = items[curr] * data[group][item].price;
    const result = acc + amount;
    return Number(result.toFixed(2));
  }, 0);

  return (
    <div className={styles.total}>
      {hasOrderInput && <span className={styles.totalTitle}>Total:</span>}
      {hasOrderInput && <span className={styles.totalPrice}>${totalPrice}</span>}
    </div>
  );
}
