import styles from "./MyGroup.module.css";

import { ReactComponent as CloseIcon } from "../../images/close_group.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteMyGroupAction,
  leaveMyGroupAction,
} from "../../services/actions/getGroupsActions";
import { useNavigate } from "react-router-dom";
export const MyGroup = ({ prop, handleOpenDropDawn = () => {} }) => {
  // const [flag, setFlag] = useState(true); //для отрисовки стилей при десктопе и мобилке
  const widthOfWindow = useGetWidthHook();
  const dispatch = useDispatch();
  const { id, name } = prop.group;
  const { is_owner } = prop;
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (widthOfWindow > 375) {
  //     setFlag(false);
  //   }
  // }, []);

  const handleDeleteGroup = () => {
    dispatch(deleteMyGroupAction(id));
  };
  const handleLeaveGroup = () => {
    dispatch(leaveMyGroupAction(id));
  };

  return (
    <div className={`${styles.groupname_wrap}`}>
      <p
        onClick={() => {
          navigate("/me/group", { state: { id: id } });
        }}
      >
        {name}
      </p>
      <div className={`${styles.groupname_wrap__info}`}>
        {is_owner ? (
          <p onClick={handleDeleteGroup}>удалить</p>
        ) : (
          <p onClick={handleLeaveGroup}>выйти</p>
        )}
        <p
          onClick={() => {
            handleOpenDropDawn(prop);
          }}
        >
          инфо
        </p>
      </div>
    </div>
  );
};
