import React from "react";
import Input from "./Input";

export default function Extras({ type, items, hasOrderInput }) {
  return (
    <section className="extras">
      <h2 className="extras-heading">{type}</h2>
      {items.map((item, index) => (
        <article className="menu-item" key={index}>
          <div className="extras-name">{item.name}</div>
          <strong className="extras-price">${item.price}</strong>
          {hasOrderInput && (
            <Input type={type} name={item.name} index={index} />
          )}
          <div className="extras-image-container">
            <img
              className="extras-image"
              src={item.image}
              alt={`${item.category} - ${item.name}`}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
