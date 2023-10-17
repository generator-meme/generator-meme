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
export const Tab = () => {
  const areFavorite = useSelector(setectCurrentFavorite);

  const dispatch = useDispatch();

  const clickHandle = () => {
    areFavorite ? dispatch(removeFavorite()) : dispatch(setFavorite());
    return;
  };

  return (
    <div className={styles.tab_box} onClick={clickHandle}>
      <div className={styles.switch_box}>
        <p style={{ color: `${areFavorite ? "#1E1D1D" : "#9b9b9b"}` }}>
          Избранные
        </p>
        <div
          className={styles.switch_panel}
          style={
            areFavorite
              ? {
                  borderColor: "#47A30F",
                }
              : null
          }
        >
          <img
            className={styles.img_switch}
            src={on_off}
            alt="ON-OFF"
            style={
              areFavorite
                ? {
                    filter:
                      "invert(50%) sepia(14%) saturate(6225%) hue-rotate(63deg) brightness(95%) contrast(88%)",
                    transform: "translateX(10px)",
                    borderColor: "#47A30F",
                  }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};
