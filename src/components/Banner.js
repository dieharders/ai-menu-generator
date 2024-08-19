import { useState, useContext } from "react";
import { Context } from "../Context";
import { useImagesData } from "../helpers/getData";
import { useAppActions } from "../actions/useAppActions";
import toast from "react-hot-toast";
import { DEFAULT_MENU_ID, SAVED_MENU_ID } from "./Generate";
import { StorageAPI } from "../helpers/storage";
import { LoadingToast } from "./LoadingToast";
import styles from "./Banner.module.scss";

const Banner = ({
  title,
  description,
  type,
  category,
  contact,
  location,
  cost,
  backgroundURL,
  children,
}) => {
  const hasImage = useImagesData()?.imageSource;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { setMenuData } = useContext(Context);
  const { onGoogleImageRequest, onGenImageRequest } = useAppActions();

  const onAction = async () => {
    setIsButtonDisabled(true);
    const item = {
      id: "banner",
      name: title,
      description: description,
      ingredients: null,
      category: category,
    };

    // @TODO replace below try/catch with shared hook
    try {
      let data = "";

      if (window.location.hostname.includes("localhost"))
        data = await onGenImageRequest(item);
      else data = await onGoogleImageRequest(item);

      // Check response ok
      if (data?.error) return data;
      // Save source to localStorage
      const menu = StorageAPI.getItem(SAVED_MENU_ID);
      const primary = menu?.find((i) => i.id === DEFAULT_MENU_ID);
      const items = primary?.items;
      const newItem = items.find((i) => i.id === item.id) || primary;

      if (!data && typeof data !== "string")
        throw new Error("Could not save image. No data returned to persist.");
      if (!newItem || !menu)
        throw new Error("Could not save image. Something went wrong.");
      // Save new menu data to disk
      newItem.imageSource = data;
      StorageAPI.setItem(SAVED_MENU_ID, menu);
      // Update menu data
      setMenuData(primary);
    } catch (err) {
      console.error(`${err}`);
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
          name={title}
          description={description}
          header="Generate image"
        />
      ),
      success: (data) => {
        // Prevents success event when canceling promise
        if (data?.error) throw new Error(data.message);
        return <b>Image saved!</b>;
      },
      error: (err) => {
        setIsButtonDisabled(false);
        return (
          <div>
            <b>Failed to generate image 😭</b>
            <p>{err?.message}</p>
          </div>
        );
      },
    });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Background image */}
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${backgroundURL})` }}
        />
        {/* Gen buttons */}
        {!hasImage && (
          <button
            disabled={isButtonDisabled}
            className={styles.imageButton}
            onClick={actionToast}
          >
            ✨ Generate image
          </button>
        )}
        {/* Company details */}
        <div className={styles.details}>
          <h1 className={styles.title}>{title || "Restaurant"}</h1>
          <span className={styles.detailSpan}>
            <b>{cost || "$"}</b>
            <b>{category || "restaurant"}</b>
            <b>{type}</b>
          </span>
          <span className={styles.detailSpan}>
            <b>{contact || "No contact"}</b>
            <b>{location || "No location"}</b>
          </span>
          <p className={styles.descr}>{description || "No description"}</p>
        </div>
      </div>
      {/* Sub-menu of buttons */}
      {children}
    </div>
  );
};

export default Banner;
