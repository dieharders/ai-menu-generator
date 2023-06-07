import QRLink from "./QRLink";
import WebLinks from "./WebLinks";
import styles from "./Footer.module.scss";

const Footer = ({data}) => {
    const origin = 'https://image-menu.vercel.app';
    const link = `${origin}/?id=${data?.companyId}`;

    return (
        <div className={styles.container}>
            <WebLinks link={link} />
            <QRLink link={link}/>
        </div>
    )
};

export default Footer;
