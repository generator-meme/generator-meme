import api from "../../utils/api";

export const GET_CATEGORIES_OPTIONS = "GET_CATEGORIES_OPTIONS";
export const SET_CATEGORIES_OPTIONS = "SET_CATEGORIES_OPTIONS";
export const SET_TAGS_OPTIONS = "SET_TAGS_OPTIONS";
export const SET_FAVORITE = "SET_FAVORITE";
export const REMOVE_FAVORITE = "REMOVE_FAVORITE";
export const SET_ORDERING = "SET_ORDERING";

const getCategoriesOptions = (categories) => ({
  type: GET_CATEGORIES_OPTIONS,
  payload: categories,
});

// export const setCategoriesOptions = (category) => ({ // проверить при подключении категорий
//   type: SET_CATEGORIES_OPTIONS,
//   payload: category,
// });

export const setTagsOptions = (tags) => ({
  type: SET_TAGS_OPTIONS,
  payload: tags,
});

export const setFavorite = () => ({
  type: SET_FAVORITE,
});

export const removeFavorite = () => ({
  type: REMOVE_FAVORITE,
});

export const setOrdering = (ordering) => ({
  type: SET_TAGS_OPTIONS,
  payload: ordering,
});

export const loadCategoriesOptions = () => async (dispatch) => {
  try {
    const categories = await api.getCategories();
    dispatch(getCategoriesOptions(categories));
  } catch (err) {
    console.log(err, "categoriesError");
  }
};
