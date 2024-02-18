import styles from "./SearchPanelMobile.module.css";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
export const SearchPanelMobile = (props) => {
  const a = props.search;
  const b = props.handleChangeSearch;
  const c = props.SortEverything;
  console.log(JSON.stringify(props?.search));
  return (
    <div className={styles.wrap_search}>
      <div className={styles.search_component}>
        <input
          onChange={(e) => b(e)}
          value={a}
          className={`${styles.text_style} ${styles.search_input}`}
          placeholder="Поиск"
        />
        <button
          className={`${styles.search_button} ${styles.btn_no_bg}`}
          onClick={(e) => c(e)}
        ></button>
      </div>
    </div>
  );
};
