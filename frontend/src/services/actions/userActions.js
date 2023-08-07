import { getCookie } from "../../utils/cookie";
import { authorisation } from "../../utils/autorisation";

export const SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN";
export const SET_IS_LOGGET_OUT = "SET_IS_LOGGET_OUT";
export const GET_USER_INFO = "GET_USER_INFO";

export const setIsLoggedIn = () => ({
  type: SET_IS_LOGGED_IN,
});

export const setIsLoggedOut = () => ({
  type: SET_IS_LOGGET_OUT,
});

const getUserInfo = (info) => ({
  type: GET_USER_INFO,
  payload: info,
});

export const loadUserInfo = () => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    console.log("try to get userData");
    const userData = await authorisation.checkToken(savedToken);
    console.log(userData, "got userData");
    dispatch(getUserInfo(userData));
  } catch (err) {
    console.log(err, "checkTokenError");
  }
};
