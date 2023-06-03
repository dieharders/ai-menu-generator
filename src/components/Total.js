import { useContext, useState } from "react";
import { Context } from "../Context";
import data from "../data";
import html2canvas from 'html2canvas';
import styles from "./Total.module.scss";

export default function Total({hasOrderInput}) {
  const [items] = useContext(Context);
  const [downloadLink, setDownloadLink] = useState('');

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    const amount = items[curr] * data[group][item].price;
    const result = acc + amount;
    return Number(result.toFixed(2));
  }, 0);

  // Take a screenshot of page
  // @TODO doesnt output images. Externally hosted images are not rendered. Save images locally.
  const captureHTML = () => {
    const screenshotTarget = document.body;
    html2canvas(screenshotTarget).then((canvas) => {
      const base64image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      setDownloadLink(base64image);
    });
  };

  return (
    <div className={styles.total}>
      {!hasOrderInput && (
        <>
          {link && <a href={downloadLink} download="menu.png">Download</a>}
          <button onClick={captureHTML} type="submit">Export Image</button>
        </>
      )}
      {hasOrderInput && <span className={styles.totalTitle}>Total:</span>}
      {hasOrderInput && <span className={styles.totalPrice}>${totalPrice}</span>}
    </div>
  );
}
