import {
  BLOCK_SAVE_BUTTON_TO_COLLECTION,
  GET_MEME_FAILED,
  GET_MEME_REQUEST,
  GET_MEME_SUCCESS,
  UN_BLOCK_SAVE_BUTTON_TO_COLLECTION,
} from "../actions/savedMemeActions";

const initialState = {
  meme: null,
  getMemeRequest: false,
  error: null,
  isLoading: true,
  isSavedMeme: false,
  blockSaveButton: false,
};

export const savedMemeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEME_REQUEST: {
      return { ...state, getMemeRequest: true, meme: null };
    }
    case GET_MEME_SUCCESS: {
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
    case BLOCK_SAVE_BUTTON_TO_COLLECTION: {
      return {
        ...state,
        blockSaveButton: true,
      };
    }
    case UN_BLOCK_SAVE_BUTTON_TO_COLLECTION: {
      return {
        ...state,
        blockSaveButton: false,
      };
    }
    default:
      return state;
  }
};
