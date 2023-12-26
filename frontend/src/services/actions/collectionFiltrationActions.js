import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import { removePreloader, setPreloader } from "./preloaderActions";

export const SEARCH_TAG = "SEARCH_TAG";
export const ADD_OFFSET = "ADD_OFFSET";
export const ADD_ORDERING = "ADD_ORDERING";
export const ADD_LIMIT = "ADD_LIMIT";

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
