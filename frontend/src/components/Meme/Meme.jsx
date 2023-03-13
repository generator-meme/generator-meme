import React from 'react';
import './Meme.css'
import { useNavigate } from 'react-router-dom';
import like from "../../images/like.svg";
import HashtagsList from '../HashtagsList/HashtagsList';

function Meme({ elem, setCurrentMeme, setIsNewMeme }) {
  const navigate = useNavigate();

  const onClick = () => {
    setCurrentMeme(elem);
    setIsNewMeme(true);
    localStorage.setItem("currentMeme", JSON.stringify(elem));
    navigate(`/${elem.id}`)
  };

  const hashtags = [
    "смелость",
    "отвага",
    "безупречность",
    "изыск",
    "смелость",
    "отвага",
    "безупречность",
    "изыск",
    "смелость",
    "отвага",
    "безупречность",
    "изыск",
    "смелость",
    "отвага",
    "безупречность",
    "изыск",
  ];
  // закомментированный код удалю позже, если этот вариант останется актуальным
  return (
    <li className="meme">
      <img className="meme__image" src={elem.image} alt="Шаблон." />
      <button onClick={onClick} className="meme__create-btn">создать мем</button>
      <div onClick={onClick} className="meme__image-hover"></div>
      <img className="meme__like" src={like} alt="Лайк." />
      <HashtagsList hashtags={hashtags} isHidden={false} />
      <HashtagsList hashtags={hashtags} isHidden={true} />
      {/* <ul className="meme__hashtags meme__hashtags_type_main">
        {hashtags.map((hashtag, index) => {
          return <li className="meme__hashtag" key={index}>#{hashtag}</li>
        })}
      </ul>
      <ul className="meme__hashtags meme__hashtags_type_hidden">
        {hashtags.map((hashtag, index) => {
          return <li className="meme__hashtag" key={index}>#{hashtag}</li>
        })}
      </ul> */}
    </li>
  )
}

export default Meme
