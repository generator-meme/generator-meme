import {
  GET_MEME_FAILED,
  GET_MEME_REQUEST,
  GET_MEME_SUCCESS,
} from "../actions/savedMemeActions";

const initialState = {
  meme: null,
  getMemeRequest: false,
  error: null,
  isLoading: true,
  isSavedMeme: false,
};

export const savedMemeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEME_REQUEST: {
      return { ...state, getMemeRequest: true };
    }
    case GET_MEME_SUCCESS: {
      console.log(action.payload);
      return {
        ...state,
        meme: action.payload,
        getMemeRequest: false,
        isLoading: false,
      };
    }
    case GET_MEME_FAILED: {
      return {
        ...state,
        newMeme: null,
        getMemeRequest: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
