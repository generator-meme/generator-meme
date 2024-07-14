import api from "../../utils/api";
import { getCookie } from "../../utils/cookie";
export const GET_GROUPS_REQUEST = "GET_GROUPS_REQUEST";
export const GET_GROUPS_SUCCESS = "GET_GROUPS_SUCCESS";
export const GET_GROUPS_FAILED = "GET_GROUPS_FAILED";
export const GET_MYGROUPS_REQUEST = "GET_MYGROUPS_REQUEST";
export const GET_MYGROUPS_SUCCESS = "GET_MYGROUPS_SUCCESS";
export const GET_MYGROUPS_FAILED = "GET_MYGROUPS_FAILED";
export const GET_GROUPINFO_REQUEST = "GET_GROUPINFO_REQUEST";
export const GET_GROUPINFO_SUCCESS = "GET_GROUPINFO_SUCCESS";
export const GET_GROUPINFO_FAILED = "GET_GROUPINFO_FAILED";
export const ENTER_IN_GROUP_REQUEST = "ENTER_IN_GROUP_REQUEST";
export const ENTER_IN_GROUP_SUCCESS = "ENTER_IN_GROUP_SUCCESS";
export const ENTER_IN_GROUP_FAILED = "ENTER_IN_GROUP_FAILED";
export const DELETE_GROUP_REQUEST = "DELETE_GROUP_REQUEST";
export const DELETE_GROUP_SUCCESS = "DELETE_GROUP_SUCCESS";
export const DELETE_GROUP_FAILED = "DELETE_GROUP_FAILED";
export const LEAVE_GROUP_REQUEST = "LEAVE_GROUP_REQUEST";
export const LEAVE_GROUP_SUCCESS = "LEAVE_GROUP_SUCCESS";
export const LEAVE_GROUP_FAILED = "LEAVE_GROUP_FAILED";
export const CREATE_GROUP_REQUEST = "CREATE_GROUP_REQUEST";
export const CREATE_GROUP_SUCCESS = "CREATE_GROUP_SUCCESS";
export const CREATE_GROUP_FAILED = "CREATE_GROUP_FAILED";

//для поиска группы по названию
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
//подгрузка своих групп
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
//подгрузка данных по группе

export const getGroupInfo = (id) => {
  return function (dispatch) {
    dispatch({ type: GET_GROUPINFO_REQUEST });

    api
      .getGroupsInfo(id)
      .then((res) => {
        console.log(1);
        dispatch({ type: GET_GROUPINFO_SUCCESS, payload: res });
      })

      .catch((err) => {
        dispatch({ type: GET_GROUPINFO_FAILED, payload: err });
      });
  };
};
//самостоятельный вход пользователя в группу

export const enterInGroupByUser = (id) => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    dispatch({ type: ENTER_IN_GROUP_REQUEST });

    api
      .enterInGroupBySelf(id, savedToken)
      .then((res) => {
        dispatch({ type: ENTER_IN_GROUP_SUCCESS, payload: res });
      })
      .then(() => {
        dispatch(getMyGroupsAction());
      })

      .catch((err) => {
        dispatch({ type: ENTER_IN_GROUP_FAILED, payload: err });
      });
  };
};
//создание группы

export const createGroupAction = (groupData) => {
  console.log("inside");
  return function (dispatch) {
    const savedToken = getCookie("token");
    dispatch({ type: CREATE_GROUP_REQUEST });
    api
      .createGroup(groupData, savedToken)
      .then((res) => {
        dispatch({ type: CREATE_GROUP_SUCCESS, payload: res });
      })
      .catch((err) => {
        dispatch({ type: CREATE_GROUP_FAILED, payload: err });
      });
    return Promise.resolve();
  };
};
//удаление группы
export const deleteMyGroupAction = (id) => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    dispatch({ type: DELETE_GROUP_REQUEST });

    api
      .deleteGroup(id, savedToken)
      .then((res) => {
        dispatch({ type: DELETE_GROUP_SUCCESS, payload: res });
      })
      .then(() => {
        dispatch(getMyGroupsAction());
      })

      .catch((err) => {
        dispatch({ type: DELETE_GROUP_FAILED, payload: err });
      });
  };
};
//выход из группы
export const leaveMyGroupAction = (id) => {
  return function (dispatch) {
    const savedToken = getCookie("token");
    dispatch({ type: LEAVE_GROUP_REQUEST });

    api
      .leaveGroup(id, savedToken)
      .then(() => {
        dispatch(getMyGroupsAction());
      })

      .catch((err) => {
        dispatch({ type: LEAVE_GROUP_FAILED, payload: err });
      });
  };
};
