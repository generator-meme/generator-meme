import styles from "./SearchPanel.module.css";
import React, { useMemo, useState } from "react";
import api from "../../utils/api";
import { useLocation } from "react-router-dom";

export const SearchPanel = ({ setFilterMemes, initMemes, tags }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isToggleSuggestPanelColor, setIsToggleSuggestPanelColor] =
    useState(false);
  const onChangeInputValue = (e) => {
    e.preventDefault();
    setIsToggleSuggestPanelColor(true);
    setSearchValue(e.target.value);
  };
  const yellowColorOfSuggestPanel = {
    backgroundColor: "rgba(253, 255, 161, 0.77)",
  };
  const whiteColorOfSuggestPanel = {
    backgroundColor: "#fff",
  };

  const submitToSearch = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tempTags = tags;
    const tagId = tempTags.filter((tag) => {
      return tag.name === searchValue;
    })[0]?.id;
    try {
      if (!searchValue) {
        setFilterMemes(initMemes);
        return;
      } else if (tagId) {
        const filteredMem = await api.getfilteredTemplates(tagId);
        setFilterMemes(filteredMem);
      } else {
        setFilterMemes([]);
      }
      setSearchValue("");
    } catch {
      console.log("err");
    }
  };
  // console.log(tags);
  const clickHandle = (tag) => {
    setSearchValue(tag);
    setIsToggleSuggestPanelColor(false);
  };
  const filteredTags = useMemo(() => {
    return tags.filter((item) => {
      const searchString = searchValue.toLowerCase();
      const tagString = item.name.toLowerCase();
      return (
        searchString &&
        tagString.startsWith(searchString) &&
        searchString !== tagString
      );
    });
  }, [tags, searchValue]);
  // console.log(filteredTags);

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
        <button className={styles.icon_wrap}> </button>
      </form>
      <div
        className={styles.suggestions_wrap}
        style={
          isToggleSuggestPanelColor && !(filteredTags.length === 0)
            ? whiteColorOfSuggestPanel
            : yellowColorOfSuggestPanel
        }
      >
        {filteredTags.slice(0, 3).map((tag) => {
          return <div onClick={() => clickHandle(tag.name)}>{tag.name}</div>;
        })}
      </div>
    </div>
  );
};
