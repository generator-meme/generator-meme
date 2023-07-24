import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm";
import { authorisation } from "../../utils/autorisation";

function Login() {
  const [abridgedVersion, setAbridgedVersion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      // разобраться с куками, записать туда token, сделать функцию для обновления, решить, через какое время нужно его удалить
      navigate("/"); // пока на главную, потом в личный кабинет?
      // console.log("вы успешло вошли", userInfo);
    } catch (err) {
      updateInputs({ email: email, password: password });
      updateErrors({
        email: err.email?.join(" "),
        password: err.password?.join(" "),
      });
      // console.log("err", err);
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
  }, []);

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
