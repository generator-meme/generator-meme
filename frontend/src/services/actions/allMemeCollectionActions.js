import { getCookie } from "../../utils/cookie";
import api from "../../utils/api";
import store from "../store";
import { changeFlag, clearQueryParam } from "./collectionFiltrationActions";

export const GET_ALL_MEME_COLLECTIONS = "GET_ALL_MEME_COLLECTIONS";
export const SET_ALL_MEME_COLLECTIONS_EMPTY = "SET_ALL_MEME_COLLECTIONS_EMPTY";

const getAllMemeCollections = (myMemes) => ({
  type: GET_ALL_MEME_COLLECTIONS,
  payload: myMemes,
});

export const setAllMemeCollectionsEmpty = () => ({
  type: SET_ALL_MEME_COLLECTIONS_EMPTY,
});

// export const getAllMyMemeCollections =  ()=> {
//     return function (dispatch,getState) {
//   try {
//     const savedToken = getCookie("token");
//     const currentFiltrationOptions = getState().collectionFiltration;
//     const myMemes = await api.getMemesInMyCollection(
//       savedToken,
//       currentFiltrationOptions
//     );
//     dispatch(getAllMemeCollections(myMemes));
//   } catch (error) {
//     console.log(error);
//   }
// }};
export const getAllMyMemeCollections = () => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    const currentFiltrationOptions =
      store.getState().collectionFiltration.queryParam;
    api
      .getMemesInMyCollection(savedToken, currentFiltrationOptions)
      .then((res) => {
        dispatch(getAllMemeCollections(res));
      })
      .catch((err) => console.log(err));
  };
};
export const deleteMemeFromMyCollection = (meme_id) => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    api.deleteMemeFromMyCollection(meme_id, savedToken).then(() => {
      dispatch(changeFlag());
    });
  };
};
