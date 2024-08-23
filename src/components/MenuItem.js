import { useState } from "react";
import { keys, translate } from "../helpers/appTranslations";
import { useImagesData } from "../helpers/getData";
import { LoadingToast } from "./LoadingToast";
import placeholder from "../assets/images/placeholder.png";
import toast from "react-hot-toast";
import { useAppActions } from "../actions/useAppActions";
import styles from "./MenuItem.module.scss";
export const MenuItem = ({ item }) => {
  const [currentDetail, setCurrentDetail] = useState("ingredients");
  const generateText = "✨Generate image";
  const { imageAction } = useAppActions();
  const imgData = useImagesData(item.id);
  const imageSrc = imgData?.imageSource ? `images/${imgData?.imageSource}` : "";

  const isMobile = () => {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  };
  const [buttonContext, setButtonContext] = useState(
    isMobile() && !item.imageSource ? generateText : ""
  );
  const [disablePhotoButton, setDisablePhotoButton] = useState(
    item?.imageSource ? true : false
  );

  const isDetailActive = (val) => {
    return currentDetail === val
      ? { borderBottomColor: "var(--secondary)" }
      : {};
  };

  const onAction = async () => {
    setDisablePhotoButton(true);
    return imageAction({
      id: item.id,
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
      category: item.category,
    });
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

  const actionToast = async () =>
    toast.promise(onAction(), {
      style: {
        minWidth: "6rem",
      },
      position: "top-center",
      loading: (
        <LoadingToast
          name={item.name}
          description={item.description}
          header="Generating image"
        />
      ),
      success: (data) => {
        // Prevents success event when canceling promise
        if (data?.error) throw new Error(data.message);
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
    });

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
        </div>
        {/* Photo */}
        <div className={styles.imageContainer}>
          <button
            className={styles.imageButton}
            disabled={disablePhotoButton}
            onClick={actionToast}
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
              src={imageSrc || placeholder}
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
