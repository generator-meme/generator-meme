import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import { setPreloader, removePreloader } from "./preloaderActions";

export const GET_ALL_MEME_TEMPLATES = "GET_ALL_MEME_TEMPLATES";
export const SET_ALL_MEME_TEMPLATES_EMPTY = "SET_ALL_MEME_TEMPLATES_EMPTY";

const getAllMemeTemplates = (templates) => ({
  type: GET_ALL_MEME_TEMPLATES,
  payload: templates,
});

export const setAllMemeTemplatesEmpty = () => ({
  type: SET_ALL_MEME_TEMPLATES_EMPTY,
});

export const loadAllMemeTemplates = (offset = 0, limit = 21) => async (dispatch, getState) => {
  try {
    if(!offset) {
      dispatch(setPreloader());
    }
    const savedToken = getCookie("token");
    const currentFiltrationOptions = getState().filtration.filtrationOptions;
    const pagination = {offset, limit}
    const templates = await api.getTemplates(
      savedToken,
      currentFiltrationOptions,
      pagination
    );
    
    const updatedTemplates = getState().allMemeTemplates.concat(templates.results)
    dispatch(getAllMemeTemplates(updatedTemplates));
    dispatch(removePreloader());
  } catch (err) {
    dispatch(removePreloader());
    console.log(err, "loadAllMemeTemplatesError");
  }
};
