import {
  SET_IS_LOGGED_IN,
  SET_IS_NOT_LOGGED_IN,
} from "../actions/isLoggedInActions";

const initialState = {
  isLoggedIn: false,
};

export const isLoggedInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_LOGGED_IN: {
      return {
        ...state,
        isLoggedIn: true,
      };
    }
    case SET_IS_NOT_LOGGED_IN: {
      return {
        ...state,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
};
