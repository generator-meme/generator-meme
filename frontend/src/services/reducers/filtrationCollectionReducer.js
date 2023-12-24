import {
  SEARCH_TAG,
  ADD_LIMIT,
  ADD_OFFSET,
  ADD_ORDERING,
} from "../actions/collectionFiltrationActions";

const initialState = {
  template_tag: "",
  offset: 0,
  ordering: "-added_at",
  only_my: "true",
  limit: 9,
};

export const filtrationCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_TAG: {
      return { ...state, template_tag: action.payload };
    }
    case ADD_LIMIT: {
      return {
        ...state,
        limit: action.payload,
      };
    }
    case ADD_OFFSET: {
      return {
        ...state,
        offset: action.payload,
      };
    }
    case ADD_ORDERING: {
      return {
        ...state,
        ordering: action.payload,
      };
    }
    default:
      return state;
  }
};
