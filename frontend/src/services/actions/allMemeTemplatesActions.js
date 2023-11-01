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

export const loadAllMemeTemplates = () => async (dispatch, getState) => {
  try {
    dispatch(setPreloader());
    const savedToken = getCookie("token");
    const currentFiltrationOptions = getState().filtration.filtrationOptions;
    const templates = await api.getTemplates(
      savedToken,
      currentFiltrationOptions
    );
    dispatch(getAllMemeTemplates(templates));
    dispatch(removePreloader());
  } catch (err) {
    dispatch(removePreloader());
    console.log(err, "loadAllMemeTemplatesError");
  }
};
