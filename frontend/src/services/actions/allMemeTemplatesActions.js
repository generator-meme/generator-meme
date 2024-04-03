import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import { setPreloader, removePreloader } from "./preloaderActions";

export const GET_ALL_MEME_TEMPLATES = "GET_ALL_MEME_TEMPLATES";
export const SET_ALL_MEME_TEMPLATES_EMPTY = "SET_ALL_MEME_TEMPLATES_EMPTY";
export const SET_NO_AVALIBLE_NEW_MEME_TO_LOAD = "SET_NO_AVALIBLE_NEW_MEME_TO_LOAD";

const getAllMemeTemplates = (templates) => ({
  type: GET_ALL_MEME_TEMPLATES,
  payload: templates,
});

export const setAllMemeTemplatesEmpty = () => ({
  type: SET_ALL_MEME_TEMPLATES_EMPTY,
});

export const setAvalibleNewMemeToLoad = () => ({
  type: SET_NO_AVALIBLE_NEW_MEME_TO_LOAD,
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

    if (templates.next === null) {
      dispatch(setAvalibleNewMemeToLoad());
    }
    const updatedTemplates = getState().allMemeTemplates.memeTemplates.concat(templates.results)
    dispatch(getAllMemeTemplates(updatedTemplates));
    dispatch(removePreloader());
  } catch (err) {
    dispatch(removePreloader());
    console.log(err, "loadAllMemeTemplatesError");
  }
};
