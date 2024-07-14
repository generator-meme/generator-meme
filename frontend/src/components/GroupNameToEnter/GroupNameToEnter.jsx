import styles from "./GroupNameToEnter.module.css";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enterInGroupByUser } from "../../services/actions/getGroupsActions";
export const GroupNameToEnter = ({
  prop = "",
  handleOpenDropDawn = () => {},
}) => {
  const [flag, setFlag] = useState(true); //для отрисовки стилей при десктопе и мобилке
  const widthOfWindow = useGetWidthHook();
  const { id } = useSelector((state) => state.user.userInfo);
  const { myGroups } = useSelector((state) => state.getGroups);
  const dispatch = useDispatch();

  useEffect(() => {
    if (widthOfWindow > 375) {
      setFlag(false);
    }
  }, []);

  const isMyGroup = myGroups.some((elem) => {
    return elem.group.id === prop.id;
  });
  //проверка на вхождение найденной группы в список моих групп

  const handleEnterToGroup = () => {
    dispatch(enterInGroupByUser(prop.id));
  };

  return (
    <div className={styles.groupname_wrap}>
      <p
        onClick={() => {
          handleOpenDropDawn(prop);
        }}
      >
        {prop.name}
      </p>
      <div className={styles.groupname_wrap__info}>
        {isMyGroup ? (
          <p>{prop.owner === id ? "администратор" : "участник"}</p>
        ) : (
          <p onClick={handleEnterToGroup}>вступить</p>
        )}
      </div>
    </div>
  );
};
