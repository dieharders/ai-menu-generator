import { useState, useEffect } from "react";
import html2canvas from 'html2canvas';
import styles from "./CaptureScreenshot.module.scss";

const CaptureScreenshot = () => {
    const [downloadLink, setDownloadLink] = useState('');
    const [hasClicked, setHasClicked] = useState(false);

    const renderButton = (
        <div className={styles.container}>
            <button onClick={() => setHasClicked(true)} type="submit" className={styles.exportButton} >Export Image</button>
            {downloadLink && <a href={downloadLink} download="menu.png" className={styles.downloadLink} >Download</a>}
        </div>
    );

    useEffect(() => {
        if (!hasClicked) return;

        // Take a screenshot of page (while hiding the buttons)
        const screenshotTarget = document.body;
        html2canvas(screenshotTarget).then((canvas) => {
            const base64image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            setDownloadLink(base64image);
            setHasClicked(false);
        });
    }, [hasClicked])
    

    return !hasClicked ? renderButton : null;
}

export default CaptureScreenshot;
