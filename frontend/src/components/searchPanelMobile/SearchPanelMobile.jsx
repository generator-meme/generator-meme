import styles from "./SearchPanelMobile.module.css";

export const SearchPanelMobile = ({
  handlerSearch,
  handlerInputSearch,
  search,
}) => {
  // const [search, setSearch] = useState("");

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
          onClick={handlerSearch}
        ></button>
      </div>
    </div>
  );
};
