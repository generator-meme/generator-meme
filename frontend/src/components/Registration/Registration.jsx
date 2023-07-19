import React, { useEffect, useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm";
import { authorisation } from "../../utils/autorisation";

function Registration() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (event, email, password, updateInputs, name) => {
    try {
      event.preventDefault();
      console.log("async");
      const signInInfo = await authorisation.signIn(name, email, password);
      setUserInfo(signInInfo);
      console.log(userInfo);
      console.log(signInInfo, "await");
      navigate("/signin-success-message");
    } catch (err) {
      updateInputs({ name: name, email: email, password: password });
      console.log("err", err);
    }
  };

  return (
    <AuthenticationForm
      info={{
        title: "Регистрация",
        isItSignIn: true,
        buttonText: "зарегистрироваться",
      }}
      handleSubmit={handleSignIn}
    ></AuthenticationForm>
  );
}

export default Registration;
