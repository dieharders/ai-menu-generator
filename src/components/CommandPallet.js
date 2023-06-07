import useCaptureScreenshot from "./CaptureScreenshotHook";
import styles from "./CommandPallet.module.scss";

const CommandPallet = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const isOrder = queryParameters.get("order");
    const isPrint = queryParameters.get("print");
    const id = queryParameters.get("id");
    const {
        downloadLink,
        onClickCallback
    } = useCaptureScreenshot();

    return (
        <div className={styles.container}>
            <a href={`${window.location.origin}/?id=${id}&order=${!isOrder}`} className={styles.iconContainer}>
                <img src={`${process.env.PUBLIC_URL}/icons/price-tag.svg`} className={styles.icon} />
                <p className={styles.title}>Order</p>
            </a>
            {!isPrint &&
                <a href={`${window.location.origin}/?id=${id}&print=true`} className={styles.iconContainer}>
                    <img src={`${process.env.PUBLIC_URL}/icons/printer.svg`} className={styles.icon} />
                    <p className={styles.title}>Print Version</p>
                </a>
            }
            {isPrint && (
                <>
                    <a href={`${window.location.origin}/?id=${id}`} className={styles.iconContainer}>
                        <img src={`${process.env.PUBLIC_URL}/icons/window.svg`} className={styles.icon} />
                        <p className={styles.title}>Web Version</p>
                    </a>
                    {/* <button onClick={onClickCallback} type="submit" className={styles.iconContainer}>
                        <img src={`${process.env.PUBLIC_URL}/icons/camera.svg`} className={styles.icon} />
                        <p className={styles.title}>Capture Image</p>
                    </button>
                    {downloadLink && <a href={downloadLink} download="menu.png" className={styles.iconContainer}>
                        <img src={`${process.env.PUBLIC_URL}/icons/image.svg`} className={styles.icon} />
                        <p className={styles.title}>Save Image</p>
                    </a>} */}
                </>
            )}
            <div className={styles.iconContainer}>
                <img src={`${process.env.PUBLIC_URL}/icons/contract.svg`} className={styles.icon} />
                <p className={styles.title}>Website</p>
            </div>
        </div>
    )
};

export default CommandPallet;
