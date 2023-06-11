import styles from "./SearchPanel.module.css";
import React, { useMemo, useState, useEffect } from "react";
import api from "../../utils/api";
import { Tag } from "../Tag/Tag";

export const SearchPanel = ({ setFilterMemes, initMemes, tags }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isToggleSuggestPanelColor, setIsToggleSuggestPanelColor] =
    useState(true);
  const [tagArray, setTagArray] = useState([]);
  const [isUnknownFlag, setIsUnknownFlag] = useState(false);

  const handleSpace = (e) => {
    if (searchValue.trim() !== "" && e.keyCode === 32) {
      const tempTagArray = [...tagArray, searchValue.trim()];
      setTagArray(tempTagArray);
      setSearchValue("");
    }
  };

  const onChangeInputValue = (e) => {
    e.preventDefault();
    setIsToggleSuggestPanelColor(true);
    setSearchValue(e.target.value.trim());
  };

  const yellowColorOfSuggestPanel = {
    backgroundColor: "rgba(253, 255, 161, 0.77)",
    overflowY: "hidden",
  };
  const whiteColorOfSuggestPanel = {
    backgroundColor: "#fff",
  };
  const stringToSearch = useMemo(() => {
    const tempTags = tags;
    const tagIdArray = tagArray.map((tagName) => {
      let tempTag;
      tempTag = tempTags.find((tag) => {
        return tag.name === tagName;
      });
      if (!tempTag) {
        return "unknownTag";
      }
      return tempTag.id;
    });
    return tagIdArray.join(",");
  }, [tagArray]);

  useEffect(() => {
    if (stringToSearch && stringToSearch.indexOf("unknownTag") !== -1) {
      setIsUnknownFlag(true);
    } else setIsUnknownFlag(false);
  }, [stringToSearch]);

  const submitToSearch = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (tagArray.length === 0) {
        setFilterMemes(initMemes);
        return;
      } else if (stringToSearch && !isUnknownFlag) {
        const filteredMem = await api.getfilteredTemplates(stringToSearch);
        setFilterMemes(filteredMem);
      } else {
        setFilterMemes([]);
      }
    } catch {
      console.log("err");
    }
  };
  // console.log(tags);
  const clickHandle = (tag) => {
    setIsToggleSuggestPanelColor(false);
    setTagArray(() => {
      return [...tagArray, tag];
    });
    setSearchValue("");
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

  const onDelete = (id) => {
    const tempTagArray = tagArray;
    const newTagArray = tempTagArray.filter((item) => {
      return item !== id;
    });
    setTagArray(newTagArray);
  };

  return (
    <div className={styles.wrap_content}>
      <div
        className={styles.wrap_background_form}
        style={
          isToggleSuggestPanelColor && !(filteredTags.length === 0)
            ? whiteColorOfSuggestPanel
            : yellowColorOfSuggestPanel
        }
      >
        <div className={styles.wrap_search_panel}>
          <form className={styles.form_search_panel}>
            {tagArray.map((tag, id) => {
              return (
                <div className={styles.tag_wrap}>
                  <Tag
                    id={id}
                    onClose={() => {
                      onDelete(tag);
                    }}
                    name={tag}
                  ></Tag>
                </div>
              );
            })}

            <input
              value={searchValue}
              onFocus={(e) => (e.target.placeholder = "")}
              onKeyDown={handleSpace}
              onChange={onChangeInputValue}
              onBlur={(e) => (e.target.placeholder = "Поиск по шаблонам")}
              type="text"
              placeholder="Поиск по шаблонам"
              className={styles.search_input}
            />
          </form>
          <button
            className={styles.button_form}
            onClick={submitToSearch}
          ></button>
        </div>
        <div className={styles.suggestions_wrap}>
          {filteredTags.map((tag) => {
            return (
              <div key={tag.id} onClick={() => clickHandle(tag.name)}>
                <p>{tag.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
