import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFavorite,
  setFavorite,
  setOrdering,
} from "../../services/actions/filtrationActions";
import { setectCurrentFavorite } from "../../services/selectors/filtrationSelectors";
import styles from "./Tab.module.css";
import on_off from "../../images/on_off.svg";
import Prompt from "../Prompt/Prompt";
import { setAllMemeTemplatesEmpty } from "../../services/actions/allMemeTemplatesActions";
export const Tab = () => {
  const areFavorite = useSelector(setectCurrentFavorite);
  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const clickHandle = () => {
    if (isLoggedIn) {
      dispatch(setAllMemeTemplatesEmpty());
      areFavorite ? dispatch(removeFavorite()) : dispatch(setFavorite());
      return;
    }

    return;
  };

  return (
    <div className={styles.tab_box} onClick={clickHandle}>
      <div className={styles.switch_box}>
        <p className={`${areFavorite ? styles.text_on : styles.text_off}`}>
          Избранные
        </p>
        <div
          className={`${styles.switch_panel} ${
            areFavorite ? styles.border_color : ""
          }`}
        >
          <img
            className={`${styles.img_switch} ${
              areFavorite ? styles.switch_toggle : ""
            }`}
            src={on_off}
            alt="ON-OFF"
          />
        </div>
      </div>
      {isLoggedIn ? (
        <></>
      ) : (
        <Prompt text={"ДОСТУПНО ЗАРЕГИСТРИРОВАННЫМ ПОЛЬЗОВАТЕЛЯМ"}></Prompt>
      )}
    </div>
  );
};
