import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
export const GET_GROUPS_REQUEST = "GET_GROUPS_REQUEST";
export const GET_GROUPS_SUCCESS = "GET_GROUPS_SUCCESS";
export const GET_GROUPS_FAILED = "GET_GROUPS_FAILED";
export const GET_MYGROUPS_REQUEST = "GET_MYGROUPS_REQUEST";
export const GET_MYGROUPS_SUCCESS = "GET_MYGROUPS_SUCCESS";
export const GET_MYGROUPS_FAILED = "GET_MYGROUPS_FAILED";

export const getGroupsAction = (name) => {
  return function (dispatch) {
    dispatch({ type: GET_GROUPS_REQUEST });

    api
      .getGroups(name)
      .then((res) => {
        dispatch({ type: GET_GROUPS_SUCCESS, payload: res });
      })

      .catch((err) => {
        dispatch({ type: GET_GROUPS_FAILED, payload: err });
      });
  };
};
export const getMyGroupsAction = () => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    dispatch({ type: GET_MYGROUPS_REQUEST });

    api
      .getMyGroups(savedToken)
      .then((res) => {
        dispatch({ type: GET_MYGROUPS_SUCCESS, payload: res });
      })

      .catch((err) => {
        dispatch({ type: GET_MYGROUPS_FAILED, payload: err });
      });
  };
};
