import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFavorite,
  setFavorite,
  setOrdering,
} from "../../services/actions/filtrationActions";
import { setectCurrentFavorite } from "../../services/selectors/filtrationSelectors";
import styles from "./Tab.module.css";
export const Tab = ({ text, param }) => {
  const areFavorite = useSelector(setectCurrentFavorite);
  const [isSelectedTab, setIsSelectedTab] = useState(false);
  const dispatch = useDispatch();

  const clickHandle = () => {
    if (param === null) {
      areFavorite ? dispatch(removeFavorite()) : dispatch(setFavorite());
      setIsSelectedTab(!isSelectedTab);
      return;
    } else {
      dispatch(setOrdering(param));
    }
  };

  return (
    <div className={styles.tab_box} onClick={clickHandle}>
      <p style={isSelectedTab ? { color: "#AC52D1" } : { color: "#000000" }}>
        {text}
      </p>
    </div>
  );
};
