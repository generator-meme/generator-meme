import api from "../../utils/api";

export const GET_CATEGORIES_OPTIONS = "GET_CATEGORIES_OPTIONS";
export const SET_CATEGORIES_OPTIONS = "SET_CATEGORIES_OPTIONS";
export const SET_TAGS_OPTIONS = "SET_TAGS_OPTIONS";
export const SET_FAVORITE = "SET_FAVORITE";
export const REMOVE_FAVORITE = "REMOVE_FAVORITE";
export const SET_ORDERING = "SET_ORDERING";
export const ADD_RANDOM_ID = "ADD_RANDOM_ID";

const getCategoriesOptions = (categories) => ({
  type: GET_CATEGORIES_OPTIONS,
  payload: categories,
});

export const setCategoriesOptions = (category) => ({
  type: SET_CATEGORIES_OPTIONS,
  payload: category,
});

export const setTagsOptions = (tags) => ({
  type: SET_TAGS_OPTIONS,
  payload: tags,
});

export const setFavorite = () => {
  return {
    type: SET_FAVORITE,
  };
};

export const removeFavorite = () => {
  return {
    type: REMOVE_FAVORITE,
  };
};

export const setOrdering = (ordering) => ({
  type: SET_ORDERING,
  payload: ordering,
});
export const addRandomId = () => ({
  type: ADD_RANDOM_ID,
});

export const loadCategoriesOptions = () => async (dispatch) => {
  try {
    const categories = await api.getCategories();
    dispatch(getCategoriesOptions(categories));
  } catch (err) {
    console.log(err, "categoriesError");
  }
};
