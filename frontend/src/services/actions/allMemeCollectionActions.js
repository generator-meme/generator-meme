import { getCookie } from "../../utils/cookie";
import api from "../../utils/api";
import store from "../store";

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
    console.log(savedToken);
    const currentFiltrationOptions = store.getState().collectionFiltration;
    console.log(currentFiltrationOptions);
    api
      .getMemesInMyCollection(savedToken, currentFiltrationOptions)
      .then((res) => {
        console.log(res);
        dispatch(getAllMemeCollections(res));
      })
      .catch((err) => console.log(err));
  };
};
