import React, { useContext } from "react";
import { Context } from "../Context";

export default function Input({ type, name, index }) {
  const [items, updateItem] = useContext(Context);

  return (
    <input
      className="input-order-number"
      type="number"
      onChange={({ target }) => updateItem(type, index, target.value)}
      name={name.replace(" ", "-").toLowerCase()}
    />
  );
}
