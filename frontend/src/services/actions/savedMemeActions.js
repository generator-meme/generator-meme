import api from "../../utils/api";
export const GET_MEME_REQUEST = "GET_MEME_REQUEST";
export const GET_MEME_SUCCESS = "GET_MEME_SUCCESS";
export const GET_MEME_FAILED = "GET_MEME_FAILED";

export const getMemeByIdAction = (id) => {
  return function (dispatch) {
    dispatch({ type: GET_MEME_REQUEST });
    api
      .getCreatedMeme(id)
      .then((res) => {
        dispatch({ type: GET_MEME_SUCCESS, payload: res });
      })
      .catch((err) => {
        dispatch({ type: GET_MEME_FAILED, payload: err });
      });
  };
};
