import styles from "./GroupName.module.css";
import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
export const GroupName = ({ name, handleOpenDropDawn = () => {} }) => {
  return (
    <div className={styles.name} onClick={() => handleOpenDropDawn()}>
      <p>{name}</p>
      <div className={styles.close_icon}>
        <CloseIcon />
      </div>
    </div>
  );
};
