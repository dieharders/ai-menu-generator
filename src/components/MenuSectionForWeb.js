import { MenuSection } from "./MenuSection";
import styles from "./MenuSectionForWeb.module.scss";

const MenuSectionForWeb = ({ items, sectionName, hasOrderInput }) => {
  return (
    <section>
      {/* Section heading */}
      <h2 className={styles.heading}>{sectionName}</h2>
      {/* Sections */}
      <div className={styles.itemsContainer}>
        {items?.map?.((item, index) => (
          <MenuSection
            key={item.id}
            item={item}
            index={index}
            sectionName={sectionName}
            hasOrderInput={hasOrderInput}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSectionForWeb;
