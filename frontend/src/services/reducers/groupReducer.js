import {
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_FAILED,
  GET_MYGROUPS_REQUEST,
  GET_MYGROUPS_SUCCESS,
  GET_MYGROUPS_FAILED,
  GET_GROUPINFO_REQUEST,
  GET_GROUPINFO_SUCCESS,
  GET_GROUPINFO_FAILED,
  ENTER_IN_GROUP_REQUEST,
  ENTER_IN_GROUP_SUCCESS,
  ENTER_IN_GROUP_FAILED,
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_FAILED,
  LEAVE_GROUP_FAILED,
  DELETE_GROUP_FAILED,
  LEAVE_GROUP_REQUEST,
} from "../actions/getGroupsActions";

const initialState = {
  groups: [],
  myGroups: [],
  error: null,
  groupInfo: [],
};

export const getGroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS_REQUEST: {
      return { ...state };
    }
    case GET_GROUPS_SUCCESS: {
      return {
        ...state,
        groups: action.payload,
      };
    }
    case GET_GROUPS_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case GET_MYGROUPS_REQUEST: {
      return { ...state };
    }
    case GET_MYGROUPS_SUCCESS: {
      return {
        ...state,
        myGroups: action.payload,
      };
    }

    case GET_MYGROUPS_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case GET_GROUPINFO_REQUEST: {
      return { ...state, groupInfo: [] };
    }
    case GET_GROUPINFO_SUCCESS: {
      return {
        ...state,
        groupInfo: action.payload,
      };
    }

    case GET_GROUPINFO_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case CREATE_GROUP_REQUEST: {
      return { ...state };
    }
    case CREATE_GROUP_SUCCESS: {
      return {
        ...state,
        // myGroups: [...state.myGroups, action.payload],
      };
    }
    case CREATE_GROUP_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case LEAVE_GROUP_REQUEST: {
      return { ...state, error: null };
    }
    case LEAVE_GROUP_FAILED: {
      return { ...state, error: action.payload };
    }

    case ENTER_IN_GROUP_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case DELETE_GROUP_FAILED: {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
