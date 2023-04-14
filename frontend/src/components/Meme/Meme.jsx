import React, { useState, useRef, useEffect } from 'react';
import './Meme.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import like from "../../images/like.svg";

function Meme({ elem, setCurrentMeme, setIsNewMeme }) {
  const [isMore, setIsMore] = useState(false);
  const [allTagsHeight, setAllTagsHeight] = useState(0);
  const navigate = useNavigate();
  const allTags = useRef(null);

  const onClick = () => {
    setCurrentMeme(elem);
    setIsNewMeme(true);
    localStorage.setItem("currentMeme", JSON.stringify(elem));
    navigate(`/${elem.id}`)
  };

  useEffect(() => {
    if (allTags.current) setAllTagsHeight(allTags.current.clientHeight);
  }, [])

  return (
    <li className="meme">
      <img className="meme__image" src={elem.image} alt={`${elem.name} шаблон.`} />
      <button onClick={onClick} className="meme__create-btn">создать мем</button>
      <div onClick={onClick} className="meme__image-hover"></div>
      <img className="meme__like" src={like} alt="Лайк." />
      {elem.tag.length > 0 && (
      <div className="meme__hashtags-container">
        <ul 
          className={`meme__hashtags ${isMore ? "meme__hashtags_more" : ""} `}
          onClick={e => setIsMore(false)}

        >
          {elem.tag.map((hashtag, index) => {
            return <li className="meme__hashtag" key={index}>#{hashtag}</li>
          })}
        </ul>
        <ul 
          ref={allTags} // невидимый полный список для сравнения высоты всех тегов с минимальной
          className="meme__hashtags meme__hashtags_more"
          style={{
            opacity: 0,
            zIndex: -2,
          }}
        >
          {elem.tag.map((hashtag, index) => {
            return <li className="meme__hashtag" key={index}>#{hashtag}</li>
          })}
        </ul>

        {!isMore && allTagsHeight > 48 && (
          <button onClick={e => setIsMore(true)} className="meme__bth-see-more">смотреть больше</button>
        )}
      </div>
    )}
    </li>
  )
}

export default Meme
