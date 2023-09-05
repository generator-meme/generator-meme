import { getCookie } from "../../utils/cookie";
import api from "../../utils/api";

export const GET_FAVORITE_TEMPLATES = "GET_FAVORITE_TEMPLATES";
export const ADD_TO_FAVORITE_TEMPLATES = "ADD_TO_FAVORITE_TEMPLATES";
export const DELETE_FROM_FAVORITE_TEMPLATES = "DELETE_FROM_FAVORITE_TEMPLATES";
export const CLEAN_FAVORITE_TEMPLATES = "CLEAN_FAVORITE_TEMPLATES";

export const getFavoriteTemplates = (favoritedTemplates) => ({
  type: GET_FAVORITE_TEMPLATES,
  payload: favoritedTemplates,
});

export const addFavoriteTemplate = (newFavorite) => ({
  type: ADD_TO_FAVORITE_TEMPLATES,
  payload: newFavorite,
});

const removeFromFavoriteTemplates = (removedTemplateId) => ({
  type: DELETE_FROM_FAVORITE_TEMPLATES,
  payload: removedTemplateId,
});

export const cleanFavoriteTemplates = () => ({
  type: CLEAN_FAVORITE_TEMPLATES,
});

export const loadFavoriteTemplates = () => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    const favoriteFiltrationOptions = {
      tags: "",
      categories: "",
      areFavorited: true,
      ordering: "",
    };
    const favoriteTemplates = await api.getTemplates(
      savedToken,
      favoriteFiltrationOptions
    );
    dispatch(getFavoriteTemplates(favoriteTemplates));
  } catch (err) {
    console.log(err, "favoritedTemplatesError");
  }
};

export const addTemplateToFavorites = (templateId) => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    const newFavorite = await api.addTemplateToFavorites(
      templateId,
      savedToken
    );
    dispatch(addFavoriteTemplate(newFavorite));
  } catch (err) {
    console.log(err, "addTemplateToFavoritesError");
  }
};

export const removeTemplateFromFavorites = (templateId) => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    api.removeTemplateFromFavorites(templateId, savedToken);
    dispatch(removeFromFavoriteTemplates(templateId));
  } catch (err) {
    console.log(err, "removeTemplateFromFavoritesError");
  }
};
