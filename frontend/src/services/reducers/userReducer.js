import {
  SET_IS_LOGGED_IN,
  SET_IS_LOGGET_OUT,
  GET_USER_INFO,
  SET_NEW_USERNAME
} from "../actions/userActions";

const initialState = {
  isLoggedIn: false,
  userInfo: {},
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case SET_NEW_USERNAME:
      return {
        ...state,
        newUsername:payload
      };
    case SET_IS_LOGGET_OUT:
      return initialState;
    case GET_USER_INFO:
      return {
        ...state,
        userInfo: payload,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};
