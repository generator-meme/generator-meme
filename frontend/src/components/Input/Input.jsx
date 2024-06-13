import styles from "./Input.module.css";

export const Input = ({ name, onChange }) => {
  return (
    <div className={styles.search_component}>
      <input
        className={`${styles.text_style} ${styles.search_input}`}
        placeholder="Название группы"
        value={name}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};
