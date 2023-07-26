import React from "react";
import EmptyPage from "../EmptyPage/EmptyPage";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookie";

function AuthUsingSocialNetworks({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handelSaveToken = (token) => {
    setCookie("token", token, 7);
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <EmptyPage
      handleRequest={handelSaveToken}
      errorNavigate="/login"
    ></EmptyPage>
  );
}

export default AuthUsingSocialNetworks;
