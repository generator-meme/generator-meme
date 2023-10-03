import { useDispatch, useSelector } from "react-redux";
import { setOrdering } from "../../services/actions/filtrationActions";
import { selectFiltrationOptions } from "../../services/selectors/filtrationSelectors";
import styles from "./Tab.module.css";
export const Tab = ({ text, param }) => {
  const { categories, areFavorite, ordering } = useSelector(
    selectFiltrationOptions
  );
  const dispatch = useDispatch();
  console.log(categories, areFavorite, ordering);
  return (
    <div
      className={styles.tab_box}
      onClick={() => {
        console.log(111, param);
        dispatch(setOrdering(param));
      }}
    >
      <p>{text}</p>
    </div>
  );
};
