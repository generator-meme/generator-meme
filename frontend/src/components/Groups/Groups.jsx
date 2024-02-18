import { useEffect, useRef, useState } from "react";
import styles from "./Groups.module.css";
import { ReactComponent as Plus } from "../../images/plus.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { SearchPanelMobile } from "../searchPanelMobile/SearchPanelMobile";
import { GroupName } from "../GroupName/GroupName";

export const Groups = () => {
  const dropDawnRef = useRef();
  const [isOpenDropDawn, setIsOpenDropDawn] = useState(false);
  const widthOfWindow = useGetWidthHook();
  const mockArr = Array(6)
    .fill("Название группы")
    .map((u, i) => "Название группы");
  const mockArr2 = Array(6)
    .fill("Название группы")
    .map((u, i) => "Пользователь");
  useEffect(() => {
    const closeDropDown = (e) => {
      if (!dropDawnRef.current.contains(e.target)) {
        setIsOpenDropDawn(false);
      }
    };
    document.addEventListener("click", closeDropDown, true);
    return () => {
      document.removeEventListener("click", closeDropDown, true);
    };
  }, []);

  const handleOpenDropDawn = () => {
    setIsOpenDropDawn(true);
  };

  return (
    <>
      <div className={styles.groups_wrap}>
        <div className={styles.header_group}>
          {widthOfWindow > 375 && <h1>Группы</h1>}
          <div className={styles.create_group}>
            <h3>Создать </h3>
            <Plus></Plus>
          </div>
        </div>
        <div className={styles.search_group}>
          {widthOfWindow > 375 && (
            <p>Для вступления в группу введите название</p>
          )}
          <div className={styles.search_wrap}>
            <SearchPanelMobile></SearchPanelMobile>
          </div>
        </div>
        <div className={styles.my_groups_wrap}>
          <h3>Мои группы</h3>
          <div className={styles.my_groups}>
            {mockArr.map((name, index) => {
              return (
                <GroupName
                  name={name}
                  id={index}
                  handleOpenDropDawn={handleOpenDropDawn}
                  flag={true}
                ></GroupName>
              );
            })}
          </div>
          {isOpenDropDawn && (
            <div ref={dropDawnRef} className={styles.group_info}>
              <div className={styles.group_info__header}>
                <span>admin</span>
              </div>
              <h1>Пользователи</h1>
              <div className={styles.my_groups__info}>
                {mockArr2.map((name, index) => {
                  return (
                    <GroupName name={name} id={index} flag={false}></GroupName>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
