import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  enterInGroupByUser,
  getGroupDataAction,
  getMyGroupsAction,
} from "../../services/actions/getGroupsActions";
import { getCookie } from "../../utils/cookie";
import styles from "./GroupInfoToenter.module.css";
import { Link, useNavigate } from "react-router-dom";

export const GroupInfoToEnter = ({ id }) => {
  const { groupInfo } = useSelector((state) => state.getGroups);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myGroups } = useSelector((state) => state.getGroups);
  const isMyGroup = myGroups.some((elem) => {
    return elem.group.id === id;
  });
  console.log(isMyGroup, myGroups, id);
  //проверка на вхождение найденной группы в список моих групп

  useEffect(() => {
    dispatch(getGroupDataAction(id));
  }, []);

  const handleEnterToGroup = () => {
    dispatch(enterInGroupByUser(id));
    navigate("/me/group");
  };

  return (
    <div className={styles.group_info}>
      <h1 className={styles.group_info__header}>{groupInfo.name}</h1>
      <p
        className={styles.group_info__text}
      >{`Участники: ${groupInfo?.users?.length} человек`}</p>

      {isMyGroup ? null : (
        <button className="btn" onClick={handleEnterToGroup}>
          вступить
        </button>
      )}
    </div>
  );
};
