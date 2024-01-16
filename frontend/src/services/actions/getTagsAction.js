import api from "../../utils/api";
export const GET_TAGS_REQUEST = "GET_TAGS_REQUEST";
export const GET_TAGS_SUCCESS = "GET_TAGS_SUCCESS";
export const GET_TAGS_FAILED = "GET_TAGS_FAILED";

export const getTagsAction = () => {
  return function (dispatch) {
    dispatch({ type: GET_TAGS_REQUEST });

    api
      .getTags()
      .then((res) => {
        dispatch({ type: GET_TAGS_SUCCESS, payload: res });
      })

      .catch((err) => {
        dispatch({ type: GET_TAGS_FAILED, payload: err });
      });
  };
};
