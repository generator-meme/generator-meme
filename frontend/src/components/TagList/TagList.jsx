import { useEffect, useRef, useState } from "react";
import styles from "./TagList.module.css";

export const TagList = ({ elem }) => {
  const [isMore, setIsMore] = useState(false);
  const [allTagsHeight, setAllTagsHeight] = useState(false);
  const allTags = useRef(null);
  const [addStyle, setAddState] = useState(null);
  useEffect(() => {
    if (allTags.current) {
      console.log(
        allTags.current.clientHeight !== allTags.current.scrollHeight,
        allTags.current.scrollHeight
      );
      setAllTagsHeight(
        allTags.current.clientHeight !== allTags.current.scrollHeight
      );
    }
  }, []);

  return (
    elem.tag.length > 0 && (
      <div className={styles.meme__tags_container} style={{ ...addStyle }}>
        <ul
          ref={allTags}
          className={
            styles.meme__tags + " " + `${isMore ? styles.meme__tags_more : ""}`
          }
          style={{ ...addStyle }}
          onClick={(e) => setIsMore(false)}
        >
          {elem.tag.map((tag, index) => {
            return (
              <li className="meme__tag" key={index}>
                #{tag.name}
              </li>
            );
          })}
        </ul>

        {!isMore && allTagsHeight && (
          <button
            onClick={(e) => {
              setIsMore(true);
              setAddState({ height: allTags.current.scrollHeight });
            }}
            className={styles.meme__bth_see_more}
          >
            смотреть больше
          </button>
        )}
      </div>
    )
  );
};
