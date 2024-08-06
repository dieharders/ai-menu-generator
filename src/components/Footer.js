import QRLink from "./QRLink";
import WebLinks from "./WebLinks";
import styles from "./Footer.module.scss";

const Footer = ({ data }) => {
  const origin = "https://idish.app";
  const realLink = `${origin}/?id=${data?.companyId}/&lang=en`;
  const visualLink = `${origin}/?id=${data?.companyId}`;
  const image = data?.bannerImageSource || "";
  const bgUrl = image ? require(`../assets/banners/${image}`) : "";

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${bgUrl})` }}
      ></div>
      <WebLinks link={visualLink} />
      <QRLink link={realLink} />
    </div>
  );
};

export default Footer;
