import { useState } from "react";
import { useDispatch } from "react-redux";
import Navigation from "../../components/Navigation/Navigation";
import { SearchPanelMobile } from "../../components/searchPanelMobile/SearchPanelMobile";

import styles from "./GroupPage.module.css";

const GroupPage = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const handlerSearch = () => {}; //необходимо добавить поиск по тэгу
  const handlerInputSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <main>
      <Navigation isGroupPage={true}></Navigation>
      <section>
        <div className={styles.group_page}>
          <div className={styles.group_page__header}>
            <div className={styles.group_page_header__block_one}>
              <h1 className={styles.header_name}>Название группы</h1>
              <div className={styles.search_module}>
                <SearchPanelMobile
                  handlerInputSearch={handlerInputSearch}
                  handlerSearch={handlerSearch}
                  search={search}
                ></SearchPanelMobile>
              </div>
            </div>
            <div className={styles.group_page_header__block_two}>
              <p className={styles.text}>Пользователи группы</p>
              <p className={styles.text}>Сортировать</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default GroupPage;
