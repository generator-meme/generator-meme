import React from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "../../components/AuthenticationForm/AuthenticationForm";
import { authorisation } from "../../utils/autorisation";

function Registration() {
  const navigate = useNavigate();

  const handleSignIn = async (
    event,
    email,
    password,
    updateInputs,
    updateErrors,
    name
  ) => {
    try {
      event.preventDefault();
      await authorisation.signIn(name, email, password);
      navigate("/signin-success-message");
    } catch (err) {
      updateInputs({ name: name, email: email, password: password });
      updateErrors({
        name: err.username?.join(" "),
        email: err.email?.join(" "),
        password: err.password?.join(" "),
      });
      // console.log("err", err);
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
