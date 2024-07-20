import { useState } from "react";
import { useDispatch } from "react-redux";
import Navigation from "../../components/Navigation/Navigation";
import { SearchPanelMobile } from "../../components/searchPanelMobile/SearchPanelMobile";
import { ReactComponent as ArrowDown } from "../../images/arrow-down.svg";

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
            <div className={styles.group_page_header__block}>
              <h1>Название группы</h1>
              <SearchPanelMobile
                handlerInputSearch={handlerInputSearch}
                handlerSearch={handlerSearch}
                search={search}
              ></SearchPanelMobile>
            </div>
            <div className={styles.group_page_header__block}>
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
