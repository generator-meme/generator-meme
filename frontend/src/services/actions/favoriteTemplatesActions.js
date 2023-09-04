import { getCookie } from "../../utils/cookie";
import { api } from "../../utils/api";

export const GET_FAVORITE_TEMPLATES = "GET_FAVORITE_TEMPLATES";
export const ADD_TO_FAVORITE_TEMPLATES = "ADD_TO_FAVORITE_TEMPLATES";
export const DELETE_FROM_FAVORITE_TEMPLATES = "DELETE_FROM_FAVORITE_TEMPLATES";

export const getFavoriteTemplates = () => ({
  type: GET_FAVORITE_TEMPLATES,
});

export const addToFavoriteTemplates = () => ({
  type: ADD_TO_FAVORITE_TEMPLATES,
});

const deleteFromFavoriteTemplates = () => ({
  type: DELETE_FROM_FAVORITE_TEMPLATES,
});

export const loadFavoriteTemplates = () => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    console.log("try to get fav tem");
    // const myFavorites = await api.(savedToken);
    // console.log(myFavorites, "got userData");
    // dispatch(getFavoriteTemplates(myFavorites));
  } catch (err) {
    console.log(err, "checkTokenError");
  }
};
