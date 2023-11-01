import {
  GET_CATEGORIES_OPTIONS,
  SET_CATEGORIES_OPTIONS,
  SET_TAGS_OPTIONS,
  SET_FAVORITE,
  REMOVE_FAVORITE,
  SET_ORDERING,
} from "../actions/filtrationActions";

const initialState = {
  categoriesOptions: [],
  favoriteOptions: {
    true: true,
    false: false,
    empty: "",
  },
  orderingOptions: {
    popular: "",
    random: "random",
    new: "-published_at",
    old: "published_at",
  },
  filtrationOptions: {
    tags: "",
    categories: "",
    areFavorite: "",
    ordering: "",
  },
};

export const filtrationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_CATEGORIES_OPTIONS:
      // const options = {};
      // for (let elem of payload) {
      //   const { id, name } = elem;
      //   options[name] = id;
      // }
      return {
        ...state,
        categoriesOptions: payload,
      };
    case SET_CATEGORIES_OPTIONS:
      return {
        ...state,
        filtrationOptions: {
          ...state.filtrationOptions,
          categories: payload,
        },
      };
    case SET_TAGS_OPTIONS:
      return {
        ...state,
        filtrationOptions: { ...state.filtrationOptions, tags: payload },
      };
    case SET_FAVORITE:
      return {
        ...state,
        filtrationOptions: {
          ...state.filtrationOptions,
          areFavorite: state.favoriteOptions.true,
          // ordering: state.orderingOptions.popular,
        },
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        filtrationOptions: {
          ...state.filtrationOptions,
          areFavorite: state.favoriteOptions.empty,
          // ordering: state.orderingOptions.popular,
        },
      };
    case SET_ORDERING:
      return {
        ...state,
        filtrationOptions: {
          ...state.filtrationOptions,
          areFavorite: state.filtrationOptions.areFavorite,
          ordering: payload,
        },
      };
    default:
      return state;
  }
};
