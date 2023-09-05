import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthenticationForm from "../../components/AuthenticationForm/AuthenticationForm";
import { authorisation } from "../../utils/autorisation";
import { setCookie } from "../../utils/cookie";
import { setIsLoggedIn } from "../../services/actions/userActions";

function Login() {
  const [abridgedVersion, setAbridgedVersion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogIn = async (
    event,
    email,
    password,
    updateInputs,
    updateErrors
  ) => {
    try {
      event.preventDefault();
      const userInfo = await authorisation.logIn(email, password);
      setCookie("token", userInfo.auth_token, 7);
      dispatch(setIsLoggedIn());
      navigate("/");
    } catch (err) {
      updateInputs({ email: email, password: password });
      updateErrors({
        email: err.email?.join(" ") || err.non_field_errors?.join(" "),
        password: err.password?.join(" ") || err.non_field_errors?.join(" "),
      });
    }
  };

  useEffect(() => {
    //если переход со страница активации или подтверждения сброса пароля - форма без полей "войти с помощью"
    if (
      location.state?.from?.pathname.includes("activate") ||
      location.state?.from?.pathname.includes("confirm")
    ) {
      setAbridgedVersion(true);
    }
  }, [location.state?.from?.pathname]);

  return (
    <AuthenticationForm
      info={{
        title: "Войдите, чтобы продолжить",
        isItSignIn: false,
        buttonText: "войти",
        abridgedVersion: abridgedVersion,
      }}
      handleSubmit={handleLogIn}
    ></AuthenticationForm>
  );
}

export default Login;
