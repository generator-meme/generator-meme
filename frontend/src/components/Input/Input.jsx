import styles from "./Input.module.css";

export const Input = () => {
  return (
    <div className={styles.search_component}>
      <input
        className={`${styles.text_style} ${styles.search_input}`}
        placeholder="Название группы"
      />
    </div>
  );
};
