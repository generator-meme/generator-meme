import React from "react";
import EmptyPage from "../EmptyPage/EmptyPage";
import { authorisation } from "../../utils/autorisation";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setPreloader,
  removePreloader,
} from "../../services/actions/preloaderActions";

function AuthActivation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const activateAccount = async (token, setResponse, uid) => {
    try {
      dispatch(setPreloader());
      await authorisation.activateAccount(uid, token);
      navigate("/login", { state: { from: location } });
      dispatch(removePreloader());
    } catch (err) {
      if (err.detail) {
        setResponse(err.detail);
      } else {
        setResponse("Что-то пошло не так, попробуйте зарегистрироваться снова");
      }
      dispatch(removePreloader());
    }
  };

  return (
    <EmptyPage
      handleRequest={activateAccount}
      errorNavigate="/signin"
    ></EmptyPage>
  );
}

export default AuthActivation;
