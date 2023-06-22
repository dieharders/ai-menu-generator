import { useContext } from "react";
import { Context } from "../Context";
import data from "../data";
// import SelectLanguage from "./SelectLanguage";
// import SearchBar from "./SearchBar";
import styles from "./Total.module.scss";

export default function Total({hasOrderInput}) {
  // const queryParameters = new URLSearchParams(window.location.search);
  // const isPrint = queryParameters.get("print");
  const isOrder = hasOrderInput === 'true';
  const [items] = useContext(Context);

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    const amount = items?.[curr] * data?.[group]?.[item]?.price;
    const result = acc + amount;
    return Number(result.toFixed(2));
  }, 0);

  return (
    <div className={styles.total}>
      {/* {!isPrint && <SelectLanguage showForm />} */}
      {/* {!isPrint && <div className={styles.searchContainer}><SearchBar /></div>} */}
      {isOrder && <span className={styles.totalTitle}>Total:</span>}
      {isOrder && <span className={styles.totalPrice}>${totalPrice}</span>}
    </div>
  );
}
