import { useEffect, useRef, useState } from "react";
import styles from "./Groups.module.css";
import { ReactComponent as Plus } from "../../images/plus.svg";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { SearchPanelMobile } from "../searchPanelMobile/SearchPanelMobile";
import { GroupName } from "../GroupName/GroupName";
import { useDispatch, useSelector } from "react-redux";

import {
  getGroupsAction,
  getMyGroupsAction,
} from "../../services/actions/getGroupsActions";
import { GroupInfo } from "../GroupInfo/GroupInfo";
import { GroupInfoToEnter } from "../GroupInfoToEnter/GroupInfoToEnter";



export const Groups = () => {
  const dropDawnRef = useRef();
  const [isOpenDropDawn, setIsOpenDropDawn] = useState(false);
  const [isSearchGroup, setIsSearchGroup] = useState(false);
  const [isUsersPopUp, setIsUsersPopUp] = useState(false);
  const [theGroupInfo, setTheGroupInfo] = useState({});
  const widthOfWindow = useGetWidthHook();
  const { myGroups, groups } = useSelector((state) => state.getGroups);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyGroupsAction());
  }, []);

  useEffect(() => {
    const closeDropDown = (e) => {
      if (!dropDawnRef?.current?.contains(e.target)) {
        setIsOpenDropDawn(false);
      }
    };
    document.addEventListener("click", closeDropDown, true);
    return () => {
      document.removeEventListener("click", closeDropDown, true);
    };
  }, []);

  const handleOpenDropDawn = (prop) => {
    setTheGroupInfo(prop);
    setIsOpenDropDawn(true);
    setIsUsersPopUp(false);
  };
  const handleOpenDropDawnEnter = (prop) => {
    setTheGroupInfo(prop);
    setIsOpenDropDawn(true);
    setIsUsersPopUp(true);
  };
  console.log(theGroupInfo);
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
            <SearchPanelMobile
              setIsSearchGroup={setIsSearchGroup}
            ></SearchPanelMobile>
          </div>
        </div>
        <div className={styles.my_groups_wrap}>
          {isSearchGroup ? null : <h3>Мои группы</h3>}
          <div className={styles.my_groups}>
            {isSearchGroup
              ? groups?.map((prop) => {
                  return (
                    <GroupName
                      id={prop.id}
                      handleOpenDropDawn={handleOpenDropDawnEnter}
                      name={prop.name}
                      prop={prop}
                      isEnterGroup={true} // true  в случае рендера поиска по группам и вступления
                    ></GroupName>
                  );
                })
              : myGroups?.map((prop) => {
                  return (
                    <GroupName
                      id={prop.group.id}
                      handleOpenDropDawn={handleOpenDropDawn}
                      name={prop.group.name}
                      prop={prop}
                      isEnterGroup={false}
                    ></GroupName>
                  );
                })}
          </div>
          {isOpenDropDawn &&
            (isUsersPopUp ? (
              <div ref={dropDawnRef}>
                <GroupInfoToEnter id={theGroupInfo.id}></GroupInfoToEnter>
              </div>
            ) : (
              <div ref={dropDawnRef}>
                <GroupInfo
                  name={theGroupInfo.role.name}
                  id={theGroupInfo.group.id}
                ></GroupInfo>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
