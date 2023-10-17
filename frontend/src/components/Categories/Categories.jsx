import { useDispatch, useSelector } from "react-redux";
import styles from "./Categories.module.css";
import { setectCategoriesOptions } from "../../services/selectors/filtrationSelectors";
import { Category } from "../Category/Category";
import { useEffect, useState } from "react";
import { setCategoriesOptions } from "../../services/actions/filtrationActions";
export const Categories = ({ isHidden }) => {
  const categories = useSelector(setectCategoriesOptions);
  const [tempCategories, setTempCategories] = useState([
    { id: "", name: "Все шаблоны", isOn: true },
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (categories.length !== 0) {
      const tempArray = categories.map((item) => {
        return { ...item, isOn: false };
      });
      setTempCategories([...tempCategories, ...tempArray]);
    }
  }, [categories]);

  const clickHandle = (id) => {
    const tempArray = tempCategories.map((item) => {
      if (item.id === id) {
        return { ...item, isOn: true };
      } else {
        return { ...item, isOn: false };
      }
    });
    setTempCategories(tempArray);
    dispatch(setCategoriesOptions(id));
  };

  return (
    <div
      className={styles.categories_box}
      style={{ visibility: `${isHidden ? "hidden" : "visible"}` }}
    >
      <div className={styles.categories_content_wrap}>
        {tempCategories.map((item) => {
          return (
            <Category
              number={item.id}
              text={item.name}
              id={item.id}
              isOn={item.isOn}
              click={() => {
                clickHandle(item.id);
              }}
            ></Category>
          );
        })}
      </div>
    </div>
  );
};
