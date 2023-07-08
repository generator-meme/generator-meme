import api from "../../utils/api";
export const POST_NEW_MEME_REQUEST = "POST_NEW_MEME_REQUEST";
export const POST_NEW_MEME_SUCCESS = "POST_NEW_MEME_SUCCESS";
export const POST_NEW_MEME_FAILED = "POST_NEW_MEME_FAILED";

export const handleCreateNewMemeAction = (memeUrl, memeId) => {
  return function (dispatch) {
    dispatch({ type: POST_NEW_MEME_REQUEST });
    api
      .createNewMem(memeUrl, memeId)
      .then((res) => {
        console.log(res);
        dispatch({ type: POST_NEW_MEME_SUCCESS, payload: res });
      })
      .catch((err) => {
        dispatch({ type: POST_NEW_MEME_FAILED, payload: err });
      });
  };
};
