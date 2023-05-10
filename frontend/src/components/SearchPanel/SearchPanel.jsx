import styles from "./SearchPanel.module.css";
import React, { useState } from "react";

export const SearchPanel = ({ memes, setFilteredMemes, toogleSearchFlag }) => {
  const [searchValue, setSearchValue] = useState("");
  const onChangeInputValue = (e) => {
    setSearchValue(e.target.value);
  };

  const submitToSearch = (e) => {
    e.preventDefault();
    const tempMemes = memes;
    if (searchValue === "") {
      toogleSearchFlag(false);
      console.log("in empty search");
      return;
    }

    const filteredMemes = tempMemes.filter((item) => {
      return item.tag.find((element) => element.name === searchValue);
    });
    console.log(filteredMemes);
    toogleSearchFlag(true);
    setFilteredMemes(filteredMemes);
  };
  return (
    <div className={styles.wrap_search_panel}>
      <form className={styles.form_search_panel} onSubmit={submitToSearch}>
        <input
          value={searchValue}
          onChange={onChangeInputValue}
          type="text"
          placeholder="Поиск по шаблонам"
          className={styles.search_input}
        />

        <button className={styles.icon_wrap}></button>
      </form>
    </div>
  );
};
