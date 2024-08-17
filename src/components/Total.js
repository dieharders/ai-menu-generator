import { useContext, useState } from "react";
import { Context } from "../Context";
import data from "../data.json";
import { PromptMenu } from "./PromptMenu";
import styles from "./Total.module.scss";

/**
 * This appears at the footer.
 * @param {boolean} hasOrderInput
 * @returns
 */
export default function Total({ hasOrderInput }) {
  const isOrder = hasOrderInput === "true";
  const { purchases } = useContext(Context);
  const [promptText, setPromptText] = useState("");
  const [items] = purchases;

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    const amount = items?.[curr] * data?.[group]?.[item]?.price;
    const result = acc + amount;
    return Number(result.toFixed(2));
  }, 0);

  return (
    <div className={styles.totalContainer}>
      <div className={styles.total}>
        <PromptMenu promptText={promptText} setPromptText={setPromptText} />
        {isOrder && <span className={styles.totalTitle}>Total:</span>}
        {isOrder && <span className={styles.totalPrice}>${totalPrice}</span>}
      </div>
    </div>
  );
}
