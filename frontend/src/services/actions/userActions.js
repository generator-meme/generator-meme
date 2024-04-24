import { getCookie, deleteCookie } from "../../utils/cookie";
import { authorisation } from "../../utils/autorisation";
// import { cleanFavoriteTemplates } from "./favoriteTemplatesActions";
import { removeFavorite } from "./filtrationActions";
import {
  loadAllMemeTemplates,
  setAllMemeTemplatesEmpty,
} from "./allMemeTemplatesActions";

export const SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN";
export const SET_NEW_USERNAME = "SET_NEW_USERNAME";
export const SET_IS_LOGGET_OUT = "SET_IS_LOGGET_OUT";
export const GET_USER_INFO = "GET_USER_INFO";

export const setIsLoggedIn = () => {
  return function (dispatch) {
    dispatch({
      type: SET_IS_LOGGED_IN,
    });
    dispatch(setAllMemeTemplatesEmpty());
    dispatch(loadAllMemeTemplates());
  };
};

const setIsLoggedOut = () => ({
  type: SET_IS_LOGGET_OUT,
});

const getUserInfo = (info) => ({
  type: GET_USER_INFO,
  payload: info,
});

export const setNewUsername = (newUserName) => ({
  type: SET_NEW_USERNAME,
  payload: newUserName,
});

export const loadUserInfo = () => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    const userData = await authorisation.checkToken(savedToken);
    dispatch(getUserInfo(userData));
  } catch (err) {
    console.log(err, "checkTokenError");
  }
};

export const logOut = () => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    await authorisation.logOut(savedToken);
    deleteCookie("token");
    dispatch(setAllMemeTemplatesEmpty());
    dispatch(loadAllMemeTemplates());
    dispatch(removeFavorite());
    dispatch(setIsLoggedOut());
  } catch (err) {
    console.log(err, "checkTokenError");
  }
};
