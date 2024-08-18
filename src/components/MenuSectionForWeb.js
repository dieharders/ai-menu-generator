import { MenuSection } from "./MenuSection";
import styles from "./MenuSectionForWeb.module.scss";

const MenuSectionForWeb = ({
  items,
  defaultImages,
  sectionName,
  hasOrderInput,
}) => {
  return (
    <section>
      {/* Section heading */}
      <h2 className={styles.heading}>{sectionName}</h2>
      {/* Sections */}
      <div className={styles.itemsContainer}>
        {items?.map?.((item, index) => {
          // Menu Item
          const menuItem = defaultImages?.find((i) => i?.id === item.id);
          const defaultImage = menuItem?.imageUrl;
          return (
            <MenuSection
              key={item.id}
              item={item}
              defaultImageSource={defaultImage}
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
