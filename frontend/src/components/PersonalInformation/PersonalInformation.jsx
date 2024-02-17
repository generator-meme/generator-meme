import { useEffect, useRef, useState } from "react";
import styles from "./PersonalInformation.module.css";
import { useNavigate } from "react-router-dom";
import { useGetWidthHook } from "../../utils/getWidthDevice";
export const PersonalInformation = () => {
  const navigate = useNavigate();
  const dropDawnRef = useRef();
  const [isOpenDropDawn, setIsOpenDropDawn] = useState(false);
  const widthOfWindow = useGetWidthHook();
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
          <h3>Имя пользователя</h3>
          <button onClick={handleOpenDropDawn} className={styles.btn_change}>
            Редактировать профиль
          </button>
        </div>
      </div>
      {isOpenDropDawn && (
        <div ref={dropDawnRef}>
          <div className={styles.change_me_info}>
            <h4>Имя пользователя</h4>
            <button
              className={styles.btn_change}
              onClick={(e) => {
                console.log(dropDawnRef);
                handleName(e);
              }}
            >
              Изменить
            </button>
            <h4>Пароль</h4>
            <button
              className={styles.btn_change}
              onClick={(e) => handlePass(e)}
            >
              Изменить
            </button>
          </div>
        </div>
      )}
    </>
  );
};
