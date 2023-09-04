import {
  GET_CATEGORIES_OPTIONS,
  SET_CATEGORIES_OPTIONS,
  SET_TAGS_OPTIONS,
  SET_FAVORITED,
} from "../actions/filtrationActions";

const initialState = {
  categoriesOptions: {},
  favoritedOptions: {
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
    areFavorited: "",
    ordering: "",
  },
};

export const filtrationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_CATEGORIES_OPTIONS:
      const options = {};
      for (let elem of payload) {
        const { id, name } = elem;
        options[name] = id;
      }
      return {
        ...state,
        categoriesOptions: options,
      };
    // case SET_CATEGORIES_OPTIONS: // пока не активно, при подключении фильтра - подправить
    //   return {
    //     ...state,
    //     filtrationOptions: {
    //       ...options,
    //       categories: payload,
    //     },
    //   };
    case SET_TAGS_OPTIONS:
      return {
        ...state,
        filtrationOptions: { ...state.filtrationOptions, tags: payload },
      };
    case SET_FAVORITED:
      return {
        ...state,
        filtrationOptions: {
          ...state.filtrationOptions,
          areFavorited: "true",
          ordering: "",
        },
      };
    default:
      return state;
  }
};
