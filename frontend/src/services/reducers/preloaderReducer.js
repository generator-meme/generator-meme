import { SET_PRELOADER, REMOVE_PRELOADER } from "../actions/preloaderActions";

export const preloaderReducer = (state = false, { type }) => {
  switch (type) {
    case SET_PRELOADER:
      return true;
    case REMOVE_PRELOADER:
      return false;
    default:
      return state;
  }
};
