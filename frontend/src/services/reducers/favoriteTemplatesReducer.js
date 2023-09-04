import {
  GET_FAVORITE_TEMPLATES,
  ADD_TO_FAVORITE_TEMPLATES,
  DELETE_FROM_FAVORITE_TEMPLATES,
} from "../actions/favoriteTemplatesActions";

export const favoriteTemplatesReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_FAVORITE_TEMPLATES:
      return payload;
    case ADD_TO_FAVORITE_TEMPLATES:
      const newFavorite = payload;
      return [...state, newFavorite];
    case DELETE_FROM_FAVORITE_TEMPLATES:
      const removedTemplateId = payload;
      return state.filter((template) => template.id !== removedTemplateId);
    default:
      return state;
  }
};
