import {
  GET_CURRENT_MEME,
  SET_CURRENT_MEME,
} from "../actions/currentMemeAction";

const initialState = {
  currentMeme: null,
};

export const currentMemeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_MEME: {
      return {
        ...state,
        currentMeme: action.payload,
      };
    }
    default:
      return state;
  }
};
