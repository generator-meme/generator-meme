import { getCookie } from "../../utils/cookie";
import api from "../../utils/api";

export const addTemplateToFavorites = (templateId) => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    await api.addTemplateToFavorites(templateId, savedToken);
  } catch (err) {
    console.log(err, "addTemplateToFavoritesError");
  }
};

export const removeTemplateFromFavorites = (templateId) => async (dispatch) => {
  try {
    const savedToken = getCookie("token");
    api.removeTemplateFromFavorites(templateId, savedToken);
  } catch (err) {
    console.log(err, "removeTemplateFromFavoritesError");
  }
};
