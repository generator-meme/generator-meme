import styles from "./GroupName.module.css";
import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
export const GroupName = ({ name, handleOpenDropDawn = () => {}, flag }) => {
  const widthOfWindow = useGetWidthHook();
  return (
    <div
      className={`${styles.name} ' ' ${flag && styles.name_subgroup}`}
      onClick={() => handleOpenDropDawn()}
    >
      <p>{name}</p>
      <div
        className={`${styles.close_icon} ' ' ${
          flag && styles.close_icon_subgroup
        }`}
      >
        {widthOfWindow > 375 || !flag ? <CloseIcon /> : <p>удалить</p>}
      </div>
    </div>
  );
};
