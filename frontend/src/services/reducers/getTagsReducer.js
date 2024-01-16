import {
  GET_TAGS_REQUEST,
  GET_TAGS_SUCCESS,
  GET_TAGS_FAILED,
} from "../actions/getTagsAction";

const initialState = {
  tags: [],
  error: null,
};

export const getTagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS_REQUEST: {
      return { ...state };
    }
    case GET_TAGS_SUCCESS: {
      console.log(action.payload);
      return {
        ...state,
        tags: action.payload,
      };
    }
    case GET_TAGS_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
