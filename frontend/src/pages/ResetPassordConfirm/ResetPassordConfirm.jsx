import React from "react";
import ResetForm from "../../components/ResetForm/ResetForm";
import { authorisation } from "../../utils/autorisation";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { inputPattern } from "../../utils/constants";

function ResetPassordConfirm() {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const location = useLocation();

  const pageInfo = {
    title: "Сброс пароля",
    fieldName: "Новый пароль",
    type: "text",
    pattern: inputPattern.password,
    inputName: "password",
    buttonText: "сохранить пароль",
    prompt:
      "Введите новый пароль. Латинские буквы, цифры и символы в количестве больше 5",
  };

  const setNewPassword = async (
    event,
    new_password,
    updateInputs,
    updateErrors
  ) => {
    try {
      event.preventDefault();
      await authorisation.resetPasswordConfirm(uid, token, new_password);
      navigate("/login", { state: { from: location } });
    } catch (err) {
      updateInputs({ password: new_password });
      updateErrors({
        password: err.new_password?.join(" "),
      });
      console.log("err", err);
    }
  };

  return <ResetForm info={pageInfo} handleSubmit={setNewPassword} />;
}

export default ResetPassordConfirm;
