import React from "react";
import EmptyPage from "../EmptyPage/EmptyPage";
import { authorisation } from "../../utils/autorisation";
import { useNavigate, useLocation } from "react-router-dom";

function AuthActivation() {
  const navigate = useNavigate();
  const location = useLocation();

  const activateAccount = async (uid, token, setResponse) => {
    try {
      await authorisation.activateAccount(uid, token);
      navigate("/login", { state: { from: location } });
    } catch (err) {
      if (err.detail) {
        setResponse(err.detail);
      } else {
        setResponse("Что-то пошло не так, попробуйте зарегистрироваться снова");
      }
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
