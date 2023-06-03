import { useContext } from "react";
import { Context } from "../Context";
import styles from "../App.module.scss";

export default function Input({ type, name, index }) {
  const [items, updateItem] = useContext(Context);

  return (
    <input
      className={styles.inputOrderNumber}
      type="number"
      onChange={({ target }) => updateItem(type, index, target.value)}
      name={name.replace(" ", "-").toLowerCase()}
    />
  );
}
