import styles from "./GroupInfo.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDataAction } from "../../services/actions/getGroupsActions";
import { GroupUser } from "../GroupUser/GroupUser";
export const GroupInfo = ({ name, id }) => {
  const { groupInfo } = useSelector((state) => state.getGroups);
  console.log(groupInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroupDataAction(id));
  }, []);
  const handleDeleteGroup = (id) => {};
  return (
    <div className={styles.group_info}>
      <div className={styles.group_info__header}>
        <span>{name}</span>
      </div>
      <h1>Пользователи</h1>
      {groupInfo.length !== 0 ? (
        <div className={styles.my_groups__info}>
          {groupInfo.users.map((prop) => {
            return <GroupUser name={prop.username} id={prop.id}></GroupUser>;
          })}
        </div>
      ) : (
        <div className={styles.my_groups__info}></div>
      )}
    </div>
  );
};