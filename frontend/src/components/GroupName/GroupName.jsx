import styles from "./GroupName.module.css";
import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useEffect, useState } from "react";
export const GroupName = ({
  prop = "",
  handleOpenDropDawn = () => {},
  isEnterGroup,
  name,
}) => {
  const [flag, setFlag] = useState(true); //для отрисовки стилей при десктопе и мобилке
  const widthOfWindow = useGetWidthHook();

  useEffect(() => {
    if (widthOfWindow > 375) {
      setFlag(false);
    }
  }, []);

  return (
    <div
      className={`${styles.name} ' ' ${
        isEnterGroup || flag ? styles.name_subgroup : null
      }`}
    >
      <p
        onClick={() => {
          handleOpenDropDawn(prop);
        }}
      >
        {name}
      </p>
      <div
        className={`${styles.close_icon} ' ' ${
          isEnterGroup || flag ? styles.close_icon_subgroup : null
        }`}
      >
        {isEnterGroup ? <p>вступить</p> : flag ? <p>удалить</p> : <CloseIcon />}
      </div>
    </div>
  );
};
