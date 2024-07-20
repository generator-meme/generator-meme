import styles from "./MyGroup.module.css";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useDispatch } from "react-redux";
import {
  deleteMyGroupAction,
  leaveMyGroupAction,
} from "../../services/actions/getGroupsActions";
import { useNavigate } from "react-router-dom";
export const MyGroup = ({ prop, handleOpenDropDawn = () => {} }) => {
  const dispatch = useDispatch();
  const { id, name } = prop.group;
  const { is_owner } = prop;
  const navigate = useNavigate();

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
