import { useState, useEffect } from "react";
import html2canvas from 'html2canvas';

const useCaptureScreenshot = () => {
    const [downloadLink, setDownloadLink] = useState('');
    const [hasClicked, setHasClicked] = useState(false);
    const onClickCallback = () => setHasClicked(true);

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
    

    return {
        downloadLink,
        onClickCallback
    };
}

export default useCaptureScreenshot;
