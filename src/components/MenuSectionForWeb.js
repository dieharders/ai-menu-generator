import { MenuSection } from "./MenuSection";
import styles from "./MenuSectionForWeb.module.scss";

// @TODO Put this code in MenuPageForWeb (port over css from MenuSectionForWeb.scss)
const MenuSectionForWeb = ({ items, sectionName, hasOrderInput }) => {
  return (
    <section>
      {/* Section heading */}
      <h2 className={styles.heading}>{sectionName}</h2>
      {/* Sections */}
      <div className={styles.itemsContainer}>
        {items?.map?.((item, index) => {
          // Menu Item
          return (
            <MenuSection
              key={item.id}
              item={item}
              index={index}
              sectionName={sectionName}
              hasOrderInput={hasOrderInput}
            />
          );
        })}
      </div>
    </section>
  );
};

export default MenuSectionForWeb;
