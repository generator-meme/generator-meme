import { useEffect, useRef, useState } from "react";
import styles from "./PersonalInformation.module.css";
import { useNavigate } from "react-router-dom";
import { useGetWidthHook } from "../../utils/getWidthDevice";
import { user } from "../../services/selectors/userSelector";
import { useSelector } from "react-redux";
export const PersonalInformation = () => {
  const navigate = useNavigate();
  const dropDawnRef = useRef();
  const [isOpenDropDawn, setIsOpenDropDawn] = useState(false);
  const widthOfWindow = useGetWidthHook();
  const { userInfo } = useSelector(user);

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

  const handleOpenDropDawn = () => {
    setIsOpenDropDawn(true);
  };

  const handleName = (e) => {
    try {
      e.preventDefault();
      navigate("/me/name-change");
    } catch (err) {
      console.log(err);
    }
  };
  const handlePass = (e) => {
    try {
      e.preventDefault();
      navigate("/me/pass-change");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isOpenDropDawn && widthOfWindow > 375 ? (
        <div className={styles.dim_filter}></div>
      ) : null}
      <div className={styles.personal_info_all}>
        {widthOfWindow > 375 && <h1>Личная информация</h1>}
        <div className={styles.personal_info_change}>
          <h3>{userInfo.username}</h3>
          <button onClick={handleOpenDropDawn} className={styles.btn_change}>
            Редактировать профиль
          </button>
          {isOpenDropDawn && (
            <div ref={dropDawnRef} className={styles.change_me_info_wrap}>
              <div className={styles.change_me_info}>
                <h3>{userInfo.username}</h3>
                <button
                  className={styles.btn_change}
                  onClick={(e) => {
                    handleName(e);
                  }}
                >
                  Изменить
                </button>
                <h3>Пароль</h3>
                <button
                  className={styles.btn_change}
                  onClick={(e) => handlePass(e)}
                >
                  Изменить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
