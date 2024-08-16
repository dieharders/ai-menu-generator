import { useState, useContext } from "react";
import { Context } from "../Context";
import Input from "./Input";
import { keys, translate } from "../helpers/appTranslations";
import { getImagesData } from "../helpers/getData";
import { useAiActions } from "../actions/useAiActions";
import placeholder from "../assets/images/placeholder.png";
import toast from "react-hot-toast";
import styles from "./MenuSectionForWeb.module.scss";
import { StorageAPI } from "../helpers/storage";
import { DEFAULT_MENU_ID, SAVED_MENU_ID } from "./Generate";

export const MenuSection = ({ item, index, sectionName, hasOrderInput }) => {
  const { setMenuData } = useContext(Context);
  const hasOrder = hasOrderInput === "true";
  const [currentDetail, setCurrentDetail] = useState("ingredients");
  const generateText = "✨Generate image";
  const isMobile = () => {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  };
  const [buttonContext, setButtonContext] = useState(
    isMobile() && !item.imageSource ? generateText : ""
  );
  const { generateMenuImage } = useAiActions();
  const [disablePhotoButton, setDisablePhotoButton] = useState(
    item?.imageSource ? true : false
  );

  const isDetailActive = (val) => {
    return currentDetail === val
      ? { borderBottomColor: "var(--secondary)" }
      : {};
  };

  const onAction = async () => {
    let data = "";
    setDisablePhotoButton(true);
    try {
      if (!item.imageSource) {
        const res = await generateMenuImage({
          name: item.name,
          description: item.description,
        });
        data = res?.imageSource;
        // Check error msg
        if (res?.error) return res;
        // Save source to localStorage
        const menu = StorageAPI.getItem(SAVED_MENU_ID);
        const primary = menu?.find((i) => i.id === DEFAULT_MENU_ID);
        const items = primary?.items;
        const newItem = items.find((i) => i.id === item.id);
        if (!newItem || !data || !menu)
          throw new Error("Could not save image. Something went wrong.");
        // Save new menu data to disk
        newItem.imageSource = data;
        StorageAPI.setItem(SAVED_MENU_ID, menu);
        // Update menu data
        setMenuData(primary);
      }
      return data;
    } catch (err) {
      return `${err}`;
    }
  };

  const getCurrencyChar = (type) => {
    switch (type) {
      case "ESP":
      case "EUR":
        return "€";
      case "YEN":
      case "JPY":
        return "￥";
      case "KRW":
        return "₩";
      case "RUB":
        return "₽";
      case "RMB":
        return "¥";
      case "USD":
        return "$";
      default:
        return "$";
    }
  };

  const LoadingComponent = () => {
    return (
      <div className={styles.loadingToast}>
        {/* Header */}
        <b>Generating...this may take some time. Do not exit page.</b>
        {/* Details */}
        <p>
          Description:{"\n"}
          {item.imageDescription}
        </p>
      </div>
    );
  };

  return (
    <article className={styles.articleContainer} key={item.id}>
      <div className={styles.mainContainer}>
        {/* Main Details */}
        <div className={styles.textContainer}>
          {/* Name */}
          <h3 className={styles.name}>{item.name}</h3>
          {/* Price */}
          <strong className={styles.price}>
            {getCurrencyChar(item.currency)}
            {item.price}
          </strong>
          {/* Description */}
          <p className={styles.description}>{item.description}</p>
          {/* Buy/Remove order buttons */}
          {hasOrder && (
            <Input type={sectionName} name={item.name} index={index} />
          )}
        </div>
        {/* Photo */}
        <div className={styles.imageContainer}>
          <button
            className={styles.imageButton}
            disabled={disablePhotoButton}
            onClick={async () =>
              toast.promise(onAction(), {
                style: {
                  minWidth: "6rem",
                },
                position: "top-center",
                loading: <LoadingComponent />,
                success: (data) => {
                  // Prevents success event when canceling promise
                  if (data?.error) throw new Error(data.message);
                  if (!data) throw new Error("No data was returned.");
                  return <b>Image saved!</b>;
                },
                error: (err) => {
                  setDisablePhotoButton(false);
                  return (
                    <div>
                      <b>Failed to generate image 😭</b>
                      <p>{err?.message}</p>
                    </div>
                  );
                },
              })
            }
            onFocus={() => {}}
            onMouseOut={() => setButtonContext("")}
            onBlur={() => {}}
            onMouseOver={() => {
              if (!item.imageSource) setButtonContext(generateText);
              else if (!isMobile()) setButtonContext("");
            }}
          >
            {buttonContext && (
              <div className={styles.genIcon}>{buttonContext}</div>
            )}
            <img
              title={item.imageDescription}
              className={styles.photo}
              src={getImagesData(item.id)?.imageSource || placeholder}
              alt={`${item.category} - ${item.name}`}
            ></img>
          </button>
        </div>
      </div>
      {/* Extra Details */}
      <div className={styles.detailsContainer}>
        <span style={{ width: "100%" }}>
          {/* Detail Name */}
          <div className={styles.detailNamesContainer}>
            <button
              style={isDetailActive("category")}
              className={styles.detailButton}
              onClick={() => setCurrentDetail("category")}
            >
              <h3 className={styles.name}>{translate(keys.CATEGORY)}</h3>
            </button>
            <button
              style={isDetailActive("ingredients")}
              className={styles.detailButton}
              onClick={() => setCurrentDetail("ingredients")}
            >
              <h3 className={styles.name}>{translate(keys.INGREDIENTS)}</h3>
            </button>
            <button
              style={isDetailActive("health")}
              className={styles.detailButton}
              onClick={() => setCurrentDetail("health")}
            >
              <h3 className={styles.name}>{translate(keys.HEALTH)}</h3>
            </button>
            <button
              style={isDetailActive("allergy")}
              className={styles.detailButton}
              onClick={() => setCurrentDetail("allergy")}
            >
              <h3 className={styles.name}>{translate(keys.ALLERGY)}</h3>
            </button>
          </div>
          {/* Selected detail description */}
          <p
            style={{
              alignItems: "center",
              marginTop: "1rem",
            }}
            className={styles.description}
          >
            {item[currentDetail] || "No info 😐"}
          </p>
        </span>
      </div>
    </article>
  );
};
