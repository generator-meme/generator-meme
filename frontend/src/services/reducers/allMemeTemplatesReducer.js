import {
  GET_ALL_MEME_TEMPLATES,
  SET_ALL_MEME_TEMPLATES_EMPTY,
} from "../actions/allMemeTemplatesActions";

export const memeTemplatesReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_ALL_MEME_TEMPLATES:
      return payload;
    case SET_ALL_MEME_TEMPLATES_EMPTY:
      return [];
    default:
      return state;
  }
};
