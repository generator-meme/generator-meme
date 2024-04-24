import {
  GET_ALL_MEME_TEMPLATES,
  SET_ALL_MEME_TEMPLATES_EMPTY,
  SET_NO_AVALIBLE_NEW_MEME_TO_LOAD,
} from "../actions/allMemeTemplatesActions";

const initialState = { memeTemplates: [], newMemesAvailable: true };

export const memeTemplatesReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GET_ALL_MEME_TEMPLATES:
      return {
        ...state,
        memeTemplates: payload,
      };
    case SET_ALL_MEME_TEMPLATES_EMPTY:
      return initialState;
    case SET_NO_AVALIBLE_NEW_MEME_TO_LOAD:
      return {
        ...state,
        newMemesAvailable: false,
      };
    default:
      return state;
  }
};
