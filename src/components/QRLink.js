import { QRCodeSVG } from 'qrcode.react';
import styles from './QRLink.module.scss';

const QRCode = ({link}) => {
    const options = {
        size: 140,
        renderAs: 'svg',
    };

    return <div className={styles.container}>
        <QRCodeSVG value={link} {...options} className={styles.code} />
    </div>
};

export default QRCode;