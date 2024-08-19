import { flushSync } from "react-dom";
import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import { removePreloader, setPreloader } from "./preloaderActions";
export const GET_MEME_REQUEST = "GET_MEME_REQUEST";
export const GET_MEME_SUCCESS = "GET_MEME_SUCCESS";
export const GET_MEME_FAILED = "GET_MEME_FAILED";
export const BLOCK_SAVE_BUTTON_TO_COLLECTION =
  "BLOCK_SAVE_BUTTON_TO_COLLECTION";
export const UN_BLOCK_SAVE_BUTTON_TO_COLLECTION =
  "UN_BLOCK_SAVE_BUTTON_TO_COLLECTION";
// export const SAVE_MEME_TO_ACCOUNT_REQUEST = "SAVE_MEME_TO_ACCOUNT_REQUEST";
// export const SAVE_MEME_TO_ACCOUNT_SUCCESS = "SAVE_MEME_TO_ACCOUNT_SUCCESS";
export const SAVE_MEME_TO_ACCOUNT_FAILED = "SAVE_MEME_TO_ACCOUNT_FAILED";

export const unBlockSaveButtonToCollection = () => {
  return {
    tyle: UN_BLOCK_SAVE_BUTTON_TO_COLLECTION,
  };
};
export const blockSaveButtonToCollection = () => {
  return {
    tyle: BLOCK_SAVE_BUTTON_TO_COLLECTION,
  };
};
export const saveMemeToAccountAction = (meme_id) => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    api
      .addMemeToMyCollection(meme_id, savedToken)
      .then(() => {
        dispatch({ type: BLOCK_SAVE_BUTTON_TO_COLLECTION });
      })
      .catch((error) => {
        dispatch({ type: SAVE_MEME_TO_ACCOUNT_FAILED, payload: error });
      });
  };
};

export const getMemeByIdAction = (id) => {
  return function (dispatch) {
    dispatch(setPreloader());
    dispatch({ type: GET_MEME_REQUEST });

    api
      .getCreatedMeme(id)
      .then((res) => {
        dispatch({ type: GET_MEME_SUCCESS, payload: res });
        dispatch(removePreloader());
      })

      .catch((err) => {
        dispatch({ type: GET_MEME_FAILED, payload: err });
      });
  };
};
