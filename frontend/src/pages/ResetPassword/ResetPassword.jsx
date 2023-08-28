import React from "react";
import ResetForm from "../../components/ResetForm/ResetForm";
import { useNavigate } from "react-router-dom";
import { authorisation } from "../../utils/autorisation";
import { inputPattern } from "../../utils/constants";

function ResetPassword() {
  const navigate = useNavigate();

  const pageInfo = {
    title: "Сброс пароля",
    fieldName: "Почта",
    type: "email",
    pattern: inputPattern.email,
    inputName: "email",
    buttonText: "сбросить пароль",
    prompt:
      "Введите вашу почту. На неё придёт письмо со ссылкой на страницу установки нового пароля",
  };

  const sendEmail = async (event, email, updateInputs, updateErrors) => {
    try {
      event.preventDefault();
      await authorisation.resetPassword(email);
      navigate("/change-password-message");
    } catch (err) {
      updateInputs({ email: email });
      updateErrors({
        email: err.email?.join(" "),
      });
      console.log("err", err);
    }
  };

  return <ResetForm info={pageInfo} handleSubmit={sendEmail} />;
}

export default ResetPassword;
