import styles from "./SearchPanel.module.css";
import React, { useMemo, useState, useEffect } from "react";
import api from "../../utils/api";
import { Tag } from "../Tag/Tag";

export const SearchPanel = ({ setFilterMemes, initMemes, tags }) => {
  const [searchValue, setSearchValue] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const [isUnknownFlag, setIsUnknownFlag] = useState(false);
  const [tagsBasedOnInputValue, setTagsBasedOnInputValue] = useState([]);
  const [isFocusSearchPanel, setIsFocusSearchPanel] = useState(true);

  useEffect(() => {
    const getTagsOnInputChange = async (name) => {
      try {
        const tagsArray = await api.getTagsWithQueryName(name);
        setTagsBasedOnInputValue(tagsArray);
      } catch {
        console.log("err");
      }
    };
    getTagsOnInputChange(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (searchValue) {
      setIsFocusSearchPanel(true);
      return;
    } else if (!searchValue && isFocusSearchPanel) {
      setIsFocusSearchPanel(false);
      return;
    }
  }, [searchValue]);

  const handleSpace = (e) => {
    if (searchValue.trim() !== "" && e.keyCode === 32) {
      const tempTagArray = [...tagArray, searchValue.trim()];
      setTagArray(tempTagArray);
      setIsFocusSearchPanel(false);
      setSearchValue(" ");
    }
  };

  const onChangeInputValue = (e) => {
    e.preventDefault();

    setSearchValue(e.target.value.trim());
  };

  const yellowColorOfSuggestPanel = {
    backgroundColor: "#FCFDB5",
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
    setIsFocusSearchPanel(false);
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
    setTagArray(() => {
      return [...tagArray, tag];
    });

    setSearchValue("");
  };

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
          isFocusSearchPanel && !(tagsBasedOnInputValue.length === 0)
            ? whiteColorOfSuggestPanel
            : yellowColorOfSuggestPanel
        }
      >
        <div className={styles.wrap_search_panel}>
          <form className={styles.form_search_panel} onSubmit={submitToSearch}>
            <div className={styles.wrap_input}>
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
                onFocus={(e) => {
                  e.target.placeholder = "";
                  setIsFocusSearchPanel(true);
                }}
                onBlur={(e) => {
                  setTimeout(() => {
                    e.target.placeholder = "Поиск по шаблонам";
                    setIsFocusSearchPanel(false);
                  }, 150);
                }}
                onKeyDown={handleSpace}
                onChange={onChangeInputValue}
                type="text"
                placeholder="Поиск по шаблонам"
                className={styles.search_input}
              />
            </div>
            <button className={styles.button_form}></button>
          </form>
        </div>

        <div
          className={styles.suggestions_wrap}
          style={{ visibility: isFocusSearchPanel ? "visible" : "hidden" }}
        >
          {tagsBasedOnInputValue.map((tag) => {
            return (
              <div key={tag.id}>
                <p
                  onClick={() => {
                    clickHandle(tag.name);
                    // setIsFocusSearchPanel(false);
                  }}
                >
                  {tag.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
