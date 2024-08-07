import React, { useCallback, useEffect, useState } from "react";
import "./LikeTemplate.css";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Like } from "../../images/like.svg";
import Prompt from "../Prompt/Prompt";
import {
  addTemplateToFavorites,
  removeTemplateFromFavorites,
} from "../../services/actions/favoriteTemplatesActions";

const LikeTemplate = ({ is_favorited, id }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const favoriteTemplates = useSelector((state) => state.favoriteTemplates);
  const [isFavorite, setIsFavorite] = useState(is_favorited);
  const dispatch = useDispatch();

  // const checkIsFavorite = useCallback(() => {
  //   return favoriteTemplates.some((item) => {

  //     return item.id === id;
  //   });
  // }, [favoriteTemplates, id]);
  // console.log(favoriteTemplates);

  const handleOnLikeClick = async (e) => {
    if (!isLoggedIn) return;
    try {
      e.preventDefault();
      if (isFavorite) {
        await dispatch(removeTemplateFromFavorites(id));
        setIsFavorite(false);
      } else {
        await dispatch(addTemplateToFavorites(id));
        setIsFavorite(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   setIsFavorite(checkIsFavorite());
  // }, [favoriteTemplates, checkIsFavorite]);

  return (
    <div className="like__container">
      <button className="like__button" onClick={handleOnLikeClick}>
        <Like className={isFavorite ? "like_is-liked" : ""} />
        {!isLoggedIn && (
          <Prompt text="ДОСТУПНО ЗАРЕГИСТРИРОВАННЫМ ПОЛЬЗОВАТЕЛЯМ" />
        )}
      </button>
    </div>
  );
};

export default LikeTemplate;
