import React, { useEffect, useState } from "react";
import "./Registration.css";
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm";

function Registration() {
  return (
    <AuthenticationForm
      info={{
        title: "Регистрация",
        isItSignIn: true,
        buttonText: "зарегистрироваться",
      }}
    ></AuthenticationForm>
  );
}

export default Registration;
