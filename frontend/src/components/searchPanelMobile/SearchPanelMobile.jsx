import styles from "./SearchPanelMobile.module.css";
import { ReactComponent as SearchButton } from "../../images/search-btn.svg";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getGroupsAction } from "../../services/actions/getGroupsActions";
export const SearchPanelMobile = (props) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const handlerInputSearch = (e) => {
    setSearch(e.target.value);
  };
  const handlerSearch = () => {
    console.log("pressed search");
    dispatch(getGroupsAction(search));
  };

  return (
    <div className={styles.wrap_search}>
      <div className={styles.search_component}>
        <input
          onChange={handlerInputSearch}
          value={search}
          className={`${styles.text_style} ${styles.search_input}`}
          placeholder="Поиск"
        />
        <button
          className={`${styles.search_button} ${styles.btn_no_bg}`}
          onClick={() => handlerSearch()}
        ></button>
      </div>
    </div>
  );
};
