import { SET_CURRENT_MEME, SET_SAVED_MEME } from "../actions/tempStoreAction";

const initialState = {
  currentMeme: null,
  savedMeme: null,
};

export const tempStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_MEME: {
      return { ...state, currentMeme: action.payload };
    }
    case SET_SAVED_MEME: {
      return {
        ...state,
        savedMeme: action.payload,
      };
    }
    default:
      return state;
  }
};
