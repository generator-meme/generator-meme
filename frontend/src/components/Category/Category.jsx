import styles from "./Category.module.css";
export const Category = ({ text, click, isOn }) => {
  return (
    <div
      className={styles.category_box}
      style={isOn ? { borderColor: "#ad27dc" } : null}
    >
      <p
        className={styles.category_text}
        onClick={() => {
          click();
        }}
      >
        {text}
      </p>
    </div>
  );
};
