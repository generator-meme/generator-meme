import React from "react";
import "./LikeTemplate.css";
import { useSelector } from "react-redux";
import { ReactComponent as Like } from "../../images/like.svg";
import Prompt from "../Prompt/Prompt";
import { getCookie } from "../../utils/cookie";
import api from "../../utils/api";

const LikeTemplate = ({ isFavorited, id }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleOnLikeClick = async (e) => {
    try {
      e.preventDefault();
      const savedToken = getCookie("token");
      if (isFavorited) {
        await api.removeTemplateFromFavorites(id, savedToken);
      } else {
        await api.addTemplateToFavorites(id, savedToken);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="like__container">
      <button className="like__button" onClick={handleOnLikeClick}>
        <Like className={isFavorited ? "like_is-liked" : ""} />
        {!isLoggedIn && (
          <Prompt text="ДОСТУПНО ЗАРЕГИСТРИРОВАННЫМ ПОЛЬЗОВАТЕЛЯМ" />
        )}
      </button>
    </div>
  );
};

export default LikeTemplate;
