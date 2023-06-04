import { useContext } from "react";
import { Context } from "../Context";
import CaptureScreenshot from "./CaptureScreenshot";
import data from "../data";
import styles from "./Total.module.scss";

export default function Total({hasOrderInput}) {
  const queryParameters = new URLSearchParams(window.location.search);
  const isDev = queryParameters.get("dev");

  const [items] = useContext(Context);

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    const amount = items[curr] * data[group][item].price;
    const result = acc + amount;
    return Number(result.toFixed(2));
  }, 0);

  return (
    <div className={styles.total}>
      {isDev && <CaptureScreenshot />}
      {hasOrderInput && <span className={styles.totalTitle}>Total:</span>}
      {hasOrderInput && <span className={styles.totalPrice}>${totalPrice}</span>}
    </div>
  );
}
