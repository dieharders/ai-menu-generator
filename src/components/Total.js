import { useContext } from "react";
import { Context } from "../Context";
import data from "../data";
import { PromptMenu } from "./PromptMenu";
import styles from "./Total.module.scss";

/**
 * This appears at the footer.
 * @param {any} hasOrderInput
 * @returns
 */
export default function Total({ hasOrderInput }) {
  const isOrder = hasOrderInput === "true";
  const [items] = useContext(Context);

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    const amount = items?.[curr] * data?.[group]?.[item]?.price;
    const result = acc + amount;
    return Number(result.toFixed(2));
  }, 0);

  return (
    <div className={styles.total}>
      <PromptMenu />
      {isOrder && <span className={styles.totalTitle}>Total:</span>}
      {isOrder && <span className={styles.totalPrice}>${totalPrice}</span>}
    </div>
  );
}
