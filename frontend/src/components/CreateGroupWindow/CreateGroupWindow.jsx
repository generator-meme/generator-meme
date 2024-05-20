import styles from "./CreateGroupWindow.module.css";
import { ReactComponent as CloseIcon } from "../../images/icons/close_icon.svg";
import { SearchPanelMobile } from "../searchPanelMobile/SearchPanelMobile";
import { Input } from "../Input/Input";
export const CreateGroupWindow = ({ closeModal }) => {
  return (
    <div className={styles.container}>
      <div className={styles.close_icon} onClick={closeModal}>
        <CloseIcon style={{ width: "20px", height: "20px" }}></CloseIcon>
      </div>
      <div className={styles.container__main_content}>
        <h2 className={styles.header}>Укажите информацию о группе</h2>
        <div className={styles.button_container}>
          <h3>Название группы</h3>
          <Input></Input>
          <button className={`${styles.main_content__btn}` + " " + "btn"}>
            создать
          </button>
        </div>
      </div>
    </div>
  );
};
