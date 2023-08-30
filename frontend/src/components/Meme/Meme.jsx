import React, { useState, useRef, useEffect } from "react";
import "./Meme.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_CURRENT_MEME } from "../../services/actions/currentMemeAction";
import LikeTemplate from "../LikeTemplate/LikeTemplate";

function Meme({ elem, setIsNewMeme }) {
  const [isMore, setIsMore] = useState(false);
  const [allTagsHeight, setAllTagsHeight] = useState(0);
  const navigate = useNavigate();
  const allTags = useRef(null);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch({ type: SET_CURRENT_MEME, payload: elem });
    setIsNewMeme(true);
    localStorage.setItem("currentMeme", JSON.stringify(elem));
    navigate(`/${elem.id}`);
  };

  useEffect(() => {
    if (allTags.current) setAllTagsHeight(allTags.current.clientHeight);
  }, []);

  return (
    <li className="meme">
      <img
        className="meme__image"
        src={elem.image}
        alt={`${elem.name} шаблон.`}
      />
      <button onClick={onClick} className="meme__create-btn">
        создать мем
      </button>
      <div onClick={onClick} className="meme__image-hover"></div>
      <LikeTemplate isFavorited={elem.is_favorited} id={elem.id} />
      {elem.tag.length > 0 && (
        <div className="meme__tags-container">
          <ul
            className={`meme__tags ${isMore ? "meme__tags_more" : ""} `}
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
          <ul
            ref={allTags} // невидимый полный список для сравнения высоты всех тегов с минимальной
            className="meme__tags meme__tags_more"
            style={{
              opacity: 0,
              zIndex: -2,
            }}
          >
            {elem.tag.map((tag, index) => {
              return (
                <li className="meme__tag" key={index}>
                  #{tag.name}
                </li>
              );
            })}
          </ul>

          {!isMore && allTagsHeight > 48 && (
            <button
              onClick={(e) => setIsMore(true)}
              className="meme__bth-see-more"
            >
              смотреть больше
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export default Meme;
