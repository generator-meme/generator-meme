import styles from "./GroupName.module.css";
import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteMyGroup,
  enterInGroupByUser,
} from "../../services/actions/getGroupsActions";
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
  const [isEnterGroupLocal, setIsEnterGroupLocal] = useState(isEnterGroup);

  useEffect(() => {
    if (widthOfWindow > 375) {
      setFlag(false);
    }
  }, []);

  const handleDeleteGroup = () => {
    dispatch(deleteMyGroup(id));
  };
  const handleEnterToGroup = () => {
    dispatch(enterInGroupByUser(id));
    setIsEnterGroupLocal(false);
  };

  return (
    <div
      className={`${styles.name} ' ' ${
        isEnterGroupLocal || flag ? styles.name_subgroup : null
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
          isEnterGroupLocal || flag ? styles.close_icon_subgroup : null
        }`}
      >
        {isEnterGroupLocal ? (
          <p onClick={handleEnterToGroup}>вступить</p>
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
