import {
  SEARCH_TAG,
  ADD_LIMIT,
  ADD_OFFSET,
  ADD_ORDERING,
  CHANGE_FLAG,
  CLEAR_QUERY_PARAM,
  ADD_PAGE,
  GET_PAGES,
} from "../actions/collectionFiltrationActions";

const initialState = {
  queryParam: {
    template_tag: "",
    offset: 0,
    ordering: "-added_at",
    only_my: "true",
    limit: 9,
  },
  flag: false,
  page: 0,
  pageArray: [],
};
const initQueryParam = {
  template_tag: "",
  offset: 0,
  ordering: "-added_at",
  only_my: "true",
  limit: 9,
};

export const filtrationCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_TAG: {
      return {
        ...state,
        queryParam: { ...state.queryParam, template_tag: action.payload },
      };
    }
    case ADD_LIMIT: {
      return {
        ...state,
        queryParam: { ...state.queryParam, limit: action.payload },
      };
    }
    case ADD_OFFSET: {
      return {
        ...state,
        queryParam: { ...state.queryParam, offset: action.payload },
      };
    }
    case ADD_ORDERING: {
      return {
        ...state,
        queryParam: { ...state.queryParam, ordering: action.payload },
      };
    }
    case CHANGE_FLAG: {
      return {
        ...state,
        flag: !state.flag,
      };
    }
    case ADD_PAGE: {
      return {
        ...state,
        page: action.payload,
      };
    }
    case GET_PAGES: {
      return {
        ...state,
        pageArray: [...action.payload],
      };
    }
    case CLEAR_QUERY_PARAM: {
      return {
        ...state,
        queryParam: { ...initQueryParam },
      };
    }
    default:
      return state;
  }
};
