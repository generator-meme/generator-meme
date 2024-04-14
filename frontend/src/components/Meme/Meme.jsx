import React from "react";
import "./Meme.css";
import { useNavigate } from "react-router-dom";
import LikeTemplate from "../LikeTemplate/LikeTemplate";
import { TagLists } from "../TagLists/TagLists";
import { useDispatch } from "react-redux";
import { SET_NEWMEME_TRUE } from "../../services/actions/memeActions";

function Meme({ elem }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch({ type: SET_NEWMEME_TRUE });
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
      <TagLists elem={elem}></TagLists>
    </li>
  );
}

export default Meme;
