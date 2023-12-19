import React from "react";
import "./Meme.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_CURRENT_MEME } from "../../services/actions/currentMemeAction";
import LikeTemplate from "../LikeTemplate/LikeTemplate";
import { TagList } from "../TagList/TagList";

function Meme({ elem, setIsNewMeme }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch({ type: SET_CURRENT_MEME, payload: elem });
    setIsNewMeme(true);
    localStorage.setItem("currentMeme", JSON.stringify(elem));
    navigate(`/${elem.id}`);
  };

  return (
    <li className="meme">
      <div className="meme__box-image">
        <img
          className="meme__image"
          src={elem.image}
          alt={`${elem.name} шаблон.`}
        />
        <button onClick={onClick} className="meme__create-btn">
          создать мем
        </button>
        <div onClick={onClick} className="meme__image-hover"></div>
        <LikeTemplate id={elem.id} />
      </div>
      <TagList elem={elem}></TagList>
    </li>
  );
}

export default Meme;
