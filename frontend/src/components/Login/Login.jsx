import React, { useEffect, useState } from "react";
import "./Login.css";
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm";

function Login() {
  return (
    <AuthenticationForm
      info={{
        title: "Войдите, чтобы продолжить",
        isItSignIn: false,
        buttonText: "войти",
      }}
    ></AuthenticationForm>
  );
}

export default Login;
