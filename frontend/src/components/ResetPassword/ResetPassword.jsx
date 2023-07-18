import React from "react";
import "./ResetPassword.css";
import ResetForm from "../ResetForm/ResetForm";

function ResetPassword() {
  const pageInfo = {
    title: "Сброс пароля",
    fieldName: "Почта",
    type: "email",
    inputName: "email",
    buttonText: "сбросить пароль",
    prompt:
      "Введите вашу почту. На неё придёт письмо со ссылкой на страницу установки нового пароля",
  };
  return <ResetForm info={pageInfo} />;
}

export default ResetPassword;
