import api from "../../utils/api";
import { removePreloader, setPreloader } from "./preloaderActions";
export const GET_TEAM_REQUEST = "GET_TEAM_REQUEST";
export const GET_TEAM_SUCCESS = "GET_TEAM_SUCCESS";
export const GET_TEAM_FAILED = "GET_TEAM_FAILED";

export const getTeamAction = () => {
  return function (dispatch) {
    dispatch(setPreloader());
    dispatch({ type: GET_TEAM_REQUEST });

    api
      .getTeam()
      .then((res) => {
        dispatch({ type: GET_TEAM_SUCCESS, payload: res });
        dispatch(removePreloader());
      })

      .catch((err) => {
        dispatch({ type: GET_TEAM_FAILED, payload: err });
      });
  };
};
