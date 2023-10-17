import styles from "./Category.module.css";
export const Category = ({ text, click, isOn }) => {
  return (
    <div
      className={styles.category_box}
      style={isOn ? { borderColor: "#ad27dc" } : null}
      onClick={() => {
        click();
      }}
    >
      <p className={styles.category_text}>{text}</p>
    </div>
  );
};
