import {
  GET_NEWMEMECREATE_FAILED,
  GET_NEWMEMECREATE_REQUEST,
  GET_NEWMEMECREATE_SUCCESS,
  SET_NEWMEME_FALSE,
  SET_NEWMEME_TRUE,
  CLEARNEWMEME,
} from "../actions/memeActions";

const initialState = {
  newMeme: null,
  getMemeRequest: false,
  isNewMeme: false,
  error: null,
  isLoading: true,
  createdMeme: null,
};

export const memeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NEWMEMECREATE_REQUEST: {
      return { ...state, getMemeRequest: true, meme: null };
    }
    case GET_NEWMEMECREATE_SUCCESS: {
      return {
        ...state,
        newMeme: action.payload,
        isNewMeme: true,
        getMemeRequest: false,
        isLoading: false,
        createdMeme: action.payload,
      };
    }
    case GET_NEWMEMECREATE_FAILED: {
      return {
        ...state,
        newMeme: null,
        getMemeRequest: false,
        error: action.payload,
      };
    }
    case SET_NEWMEME_FALSE: {
      return {
        ...state,
        isNewMeme: false,
      };
    }
    case SET_NEWMEME_TRUE: {
      return {
        ...state,
        isNewMeme: true,
      };
    }
    case CLEARNEWMEME: {
      return {
        ...state,
        newMeme: null,
      };
    }

    default:
      return state;
  }
};
