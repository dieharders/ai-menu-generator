import SelectLanguage from "./SelectLanguage";
import iconLanguage from "../assets/icons/icon-lang.svg";
import iconHome from "../assets/icons/icon-home.svg";
import iconWebsite from "../assets/icons/icon-website.svg";
import { keys, translate } from "../helpers/appTranslations";
import styles from "./CommandPallet.module.scss";

const CommandPallet = ({ data }) => {
  const website = data?.website;

  return (
    // Buttons
    <div className={styles.container}>
      {/* Go home button */}
      <a href={window.location.origin} className={styles.iconContainer}>
        <img
          alt="home page"
          title="go home"
          src={iconHome}
          className={styles.icon}
        />
        <p className={styles.title}>Home</p>
      </a>
      {/* Set language button */}
      <div className={styles.iconContainer}>
        <img
          alt="language"
          title="set language"
          src={iconLanguage}
          className={styles.icon}
        />
        <SelectLanguage />
      </div>
      {/* Go to menu website button */}
      {website && (
        <a
          href={website}
          className={[styles.iconContainer, styles.link].join(" ")}
        >
          <img
            alt="website"
            title="go to menu website"
            src={iconWebsite}
            className={styles.icon}
          />
          <p className={styles.title}>{translate(keys.WEBSITE)}</p>
        </a>
      )}
    </div>
  );
};

export default CommandPallet;
