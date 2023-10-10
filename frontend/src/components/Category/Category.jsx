import { useDispatch } from "react-redux";
import { setCategoriesOptions } from "../../services/actions/filtrationActions";
import styles from "./Category.module.css";
export const Category = ({ text, number }) => {
  const dispatch = useDispatch();
  const clickHandle = (id) => {
    dispatch(setCategoriesOptions(id));
  };
  return (
    <div className={styles.category_box}>
      <p className={styles.category_text} onClick={() => clickHandle(number)}>
        {text}
      </p>
    </div>
  );
};
