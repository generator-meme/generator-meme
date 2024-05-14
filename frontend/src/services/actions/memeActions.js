import api from "../../utils/api";

export const GET_NEWMEMECREATE_REQUEST = "GET_NEWMEMECREATE_REQUEST";
export const GET_NEWMEMECREATE_SUCCESS = "GET_NEWMEMECREATE_SUCCESS";
export const GET_NEWMEMECREATE_FAILED = "GET_NEWMEMECREATE_FAILED";
export const ADD_NEW_MEME = "ADD_NEW_MEME";
export const SET_NEWMEME_FALSE = "SET_NEWMEME_FALSE";
export const SET_NEWMEME_TRUE = "SET_NEWMEME_TRUE";
export const CLEARNEWMEME = "CLEARNEWMEME";

export const createNewMemeAction = (memeUrl, memeId) => {
  return function (dispatch) {
    dispatch({ type: GET_NEWMEMECREATE_REQUEST });
    api
      .createNewMem(memeUrl, memeId)
      .then((res) => {
        // localStorage.setItem("createdMeme", JSON.stringify(res));
        dispatch({ type: GET_NEWMEMECREATE_SUCCESS, payload: res });
      })
      .catch((err) => {
        dispatch({ type: GET_NEWMEMECREATE_FAILED, payload: err });
        console.log(err);
      });
  };
};
