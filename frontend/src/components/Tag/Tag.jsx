import styles from "./Tag.module.css";
import close_icon from "../../images/icons/close_icon.svg";

export const Tag = ({ name, id, onClose }) => {
  return (
    <div
      className={styles.wrap}
      style={
        id === 0
          ? { borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }
          : { borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }
      }
    >
      <div className={styles.wrap_tag}>
        <p>{name}</p>
        <div className={styles.close_icon} onClick={onClose}>
          <img src={close_icon} alt="close icon" />
        </div>
      </div>
    </div>
  );
};
