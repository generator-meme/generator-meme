import { useSelector } from "react-redux";
import styles from "./Categories.module.css";
import { setectCategoriesOptions } from "../../services/selectors/filtrationSelectors";
import { Category } from "../Category/Category";
export const Categories = ({ isHidden }) => {
  const categories = useSelector(setectCategoriesOptions);

  return (
    <div
      className={styles.categories_box}
      style={{ visibility: `${isHidden ? "hidden" : "visible"}` }}
    >
      <div className={styles.categories_content_wrap}>
        <Category number={""} text={"Все шаблоны"}></Category>
        {categories.map((item) => {
          return (
            <Category number={item.id} text={item.name} id={item.id}></Category>
          );
        })}
      </div>
    </div>
  );
};
