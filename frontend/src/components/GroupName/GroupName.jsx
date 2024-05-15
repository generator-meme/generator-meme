import styles from "./GroupName.module.css";
import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteMyGroup } from "../../services/actions/getGroupsActions";
export const GroupName = ({
  id,
  prop = "",
  handleOpenDropDawn = () => {},
  isEnterGroup,
  name,
}) => {
  const [flag, setFlag] = useState(true); //для отрисовки стилей при десктопе и мобилке

  const widthOfWindow = useGetWidthHook();

  const dispatch = useDispatch();

  useEffect(() => {
    if (widthOfWindow > 375) {
      setFlag(false);
    }
  }, []);

  const handleDeleteGroup = () => {
    dispatch(deleteMyGroup(id));
  };

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
        {isEnterGroup ? (
          <p>вступить</p>
        ) : flag ? (
          <p onClick={handleDeleteGroup}>удалить</p>
        ) : (
          <div onClick={handleDeleteGroup}>
            <CloseIcon />
          </div>
        )}
      </div>
    </div>
  );
};
