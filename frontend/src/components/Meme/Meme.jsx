import React from 'react';
import './Meme.css'
import { useNavigate } from 'react-router-dom';
import like from "../../images/like.svg";

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
  ];

  return (
    <li className="meme">
      <img className="meme__image" src={elem.image} alt="Шаблон." />
      <div className="meme__image-hover"></div>
      <img className="meme__like" src={like} alt="Лайк." />
      <button onClick={onClick} className="meme__create-btn">создать мем</button>
      <ul className="meme__hashtags">
        {hashtags.map((hashtag, index) => {
          return <li className="meme__hashtag" key={index}>#{hashtag}</li>
        })}
      </ul>
    </li>
  )
}

export default Meme
