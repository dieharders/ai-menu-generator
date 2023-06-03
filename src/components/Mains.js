import React from "react";
import Input from "./Input";

export default function Mains({ meals, hasOrderInput }) {
  return (
    <section className="mains">
      {meals.map((meal, index) => (
        <article className="menu-item" key={index}>
          <h3 className="mains-name">{meal.name}</h3>
          <strong className="mains-price">${meal.price}</strong>
          {hasOrderInput && (
            <Input type="mains" name={meal.name} index={index} />
          )}
          <div className="mains-image-container">
            <img
              className="mains-image"
              src={meal.image}
              alt={`${meal.category} - ${meal.name}`}
            />
          </div>
          <p className="mains-description">{meal.description}</p>
        </article>
      ))}
    </section>
  );
}
