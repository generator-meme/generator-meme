import { Action } from "history";
import {
  GET_ALL_MEME_COLLECTIONS,
  SET_ALL_MEME_COLLECTIONS_EMPTY,
} from "../actions/allMemeCollectionActions";

const initialState = {
  myMemes: null,
};
export const allMyMemesCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MEME_COLLECTIONS:
      console.log(action.payload);
      return { ...state, myMemes: action.payload };
    case SET_ALL_MEME_COLLECTIONS_EMPTY:
      return { ...state, myMemes: [] };
    default:
      return state;
  }
};
