import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupInfo } from "../../services/actions/getGroupsActions";
import styles from "./GroupInfoToenter.module.css";

export const GroupInfoToEnter = ({ id }) => {
  const { groupInfo } = useSelector((state) => state.getGroups);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroupInfo(id));
  }, []);
  return (
    <div className={styles.group_info}>
      <div className={styles.group_info__header}>
        <span></span>
      </div>
      <h1>Пользователи</h1>
      <p>{groupInfo?.users?.length}</p>

      <div className={styles.my_groups__info}></div>
    </div>
  );
};
