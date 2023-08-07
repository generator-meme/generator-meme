import React from "react";
import EmptyPage from "../EmptyPage/EmptyPage";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookie";
import { setIsLoggedIn } from "../../services/actions/userActions";

function AuthUsingSocialNetworks() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelSaveToken = (token, setResponse) => {
    try {
      setCookie("token", token, 7);
      // navigate("/");
      dispatch(setIsLoggedIn());
      console.log("получила токен из сторонних сетей");
      // setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      if (err.detail) {
        setResponse(err.detail);
      } else {
        setResponse("Что-то пошло не так, попробуйте войти снова");
      }
      console.log(err);
    }
  };

  return (
    <EmptyPage
      handleRequest={handelSaveToken}
      errorNavigate="/login"
    ></EmptyPage>
  );
}

export default AuthUsingSocialNetworks;
