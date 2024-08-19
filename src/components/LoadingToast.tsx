import styles from "./LoadingToast.module.scss";

// Loading toast component
export const LoadingToast = ({ name, description, header }: { name: string, description: string, header: string }) => {
  return (
    <div className={styles.loadingToast}>
      {/* Header */}
      <b>{header}...this may take some time. Do not exit page.</b>
      {/* Details */}
      <p>
        Name: {name}
        {"\n"}
        Description:{"\n"}
        {description || "No description"}
      </p>
    </div>
  );
};