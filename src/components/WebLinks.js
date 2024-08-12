import styles from "./WebLinks.module.scss";

const WebLinks = ({ link }) => {
  return (
    <div className={styles.container}>
      <p className={styles.companyTitle}>Built w/ ❤️ by OpenBrewAi</p>
      <div className={styles.linkContainer}>
        <h3 className={styles.description}>Access web version for more info</h3>
        <a href={link} className={styles.linkText}>
          {link}
        </a>
      </div>
    </div>
  );
};

export default WebLinks;
