import { useContext } from "react";
import { Context } from "../Context";
import styles from "./Input.module.scss";

export default function Input({ type, name, index }) {
  const { purchases } = useContext(Context);
  const [_items, updateItem] = purchases;

  return (
    <input
      placeholder="0"
      min="0"
      max="99"
      className={styles.order}
      type="number"
      onChange={({ target }) => updateItem(type, index, target.value)}
      name={name.replace(" ", "-").toLowerCase()}
    />
  );
}
