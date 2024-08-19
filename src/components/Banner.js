import { useState } from "react";
import { useImagesData } from "../helpers/getData";
import { useAppActions } from "../actions/useAppActions";
import toast from "react-hot-toast";
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
  const { imageAction } = useAppActions();

  const onAction = async () => {
    setIsButtonDisabled(true);
    const item = {
      id: "banner",
      name: title,
      description: description,
      ingredients: null,
      category: category,
    };
    return imageAction(item);
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
          header="Generating image"
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
