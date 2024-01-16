import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import { removePreloader, setPreloader } from "./preloaderActions";

export const SEARCH_TAG = "SEARCH_TAG";
export const ADD_OFFSET = "ADD_OFFSET";
export const ADD_ORDERING = "ADD_ORDERING";
export const ADD_LIMIT = "ADD_LIMIT";
export const CHANGE_FLAG = "CHANGE_FLAG";
export const CLEAR_QUERY_PARAM = "CLEAR_QUERY_PARAM";

export const addLimit = (limit) => ({
  type: ADD_LIMIT,
  payload: limit,
});
export const addOffset = (offset) => ({
  type: ADD_OFFSET,
  payload: offset,
});

export const searchTag = (text) => {
  console.log("i am in action", text);
  return {
    type: SEARCH_TAG,
    payload: text,
  };
};
export const addOrdering = (ordering) => ({
  type: ADD_ORDERING,
  payload: ordering,
});
export const changeFlag = () => ({
  type: CHANGE_FLAG,
});
export const clearQueryParam = () => {
  console.log("clear");
  return {
    type: CLEAR_QUERY_PARAM,
  };
};
