import {
  GET_TEAM_REQUEST,
  GET_TEAM_SUCCESS,
  GET_TEAM_FAILED,
} from "../actions/teamAction";

const initialState = {
  team: null,
  getTeamRequest: false,
  error: null,
};

export const teamReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAM_REQUEST: {
      return { ...state, getTeamRequest: true };
    }
    case GET_TEAM_SUCCESS: {
      return {
        ...state,
        team: action.payload,
        getTeamRequest: false,
      };
    }
    case GET_TEAM_FAILED: {
      return {
        ...state,
        team: null,
        getTeamRequest: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
