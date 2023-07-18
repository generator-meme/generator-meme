import React, { useEffect, useState } from "react";
import "./AuthenticationForm.css";
import { Link, useNavigate } from "react-router-dom";
import { formPrompts } from "../../utils/constants";
import FormPrompt from "../FormPrompt/FormPrompt";
import AuthenticationInputValid from "../AuthenticationInputValid/AuthenticationInputValid";
import { ReactComponent as Vkontakte } from "../../images/authenticationPage/vkontakte.svg";
import { ReactComponent as Telegram } from "../../images/authenticationPage/telegram.svg";
import { ReactComponent as Google } from "../../images/authenticationPage/google-copy.svg";
import { ReactComponent as Yandex } from "../../images/authenticationPage/yandex.svg";

function AuthenticationForm({ info, handleSubmit }) {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDirectedFromThisSite, setIsDirectedFromThisSite] = useState(true);

  useEffect(() => {
    if (document.referrer === "") {
      setIsDirectedFromThisSite(false);
    }
  }, []);

  const navigate = useNavigate();

  const onChange = (event) => {
    // данные формы и валидация
    const { name, value, validationMessage } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validationMessage,
    }));

    if (event.target.closest("form").checkValidity()) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const onSubmit = (event) => {
    handleSubmit(event, values.email, values.password, setValues, values.name);
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubmitted) {
      setValues(() => ({
        name: "",
        email: "",
        password: "",
      }));
      setIsValid(false);
    }
    return setIsSubmitted(false);
  }, [isSubmitted]);

  return (
    <main className="authentication">
      <div
        className="authentication__container"
        style={{
          rowGap: info.isItSignIn ? 10 : 30,
        }}
      >
        <h2 className="authentication__title">{info.title}</h2>
        <form
          className="authentication__form"
          onSubmit={onSubmit}
          style={{
            rowGap: info.isItSignIn ? 10 : 0,
          }}
        >
          {info.isItSignIn && (
            <label className="authentication__label">
              <span className="authentication__input-name">
                Имя пользователя
              </span>
              <input
                type="text"
                name="name"
                pattern="[A-Za-z0-9]{3,40}"
                value={values.name}
                onChange={onChange}
                className={`authentication__input ${
                  errors.name?.length > 1
                    ? "authentication__input_type_error"
                    : ""
                }`}
                placeholder="Valeria Rusakova"
                required
              />
              <AuthenticationInputValid
                error={errors.name}
                value={values.name}
              />
              <FormPrompt
                errorName={errors.name}
                spanName={formPrompts.name}
                isVisible={info.isItSignIn}
              />
            </label>
          )}
          <label className="authentication__label">
            {info.isItSignIn && (
              <span className="authentication__input-name">Почта</span>
            )}
            <input
              type="email"
              value={values.email}
              onChange={onChange}
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"
              className={`authentication__input ${
                errors.email?.length > 1
                  ? "authentication__input_type_error"
                  : ""
              }`}
              placeholder={`${
                info.isItSignIn ? "ValeriaRusakova@mail.ru" : "Email"
              }`}
              required
            />
            {info.isItSignIn && (
              <AuthenticationInputValid
                error={errors.email}
                value={values.email}
              />
            )}
            <FormPrompt
              errorName={errors.email}
              spanName={formPrompts.email}
              isVisible={info.isItSignIn}
            />
          </label>
          <label className="authentication__label">
            {info.isItSignIn && (
              <span className="authentication__input-name">Пароль</span>
            )}
            <input
              type="text"
              value={values.password}
              pattern="[^А-Я^а-я]{5,16}"
              onChange={onChange}
              name="password"
              className={`authentication__input ${
                errors.password?.length > 1
                  ? "authentication__input_type_error"
                  : ""
              }`}
              placeholder={`${info.isItSignIn ? "Ssscrumble_" : "Пароль"}`}
              required
            />
            {info.isItSignIn && (
              <AuthenticationInputValid
                error={errors.password}
                value={values.password}
              />
            )}
            <FormPrompt
              errorName={errors.password}
              spanName={formPrompts.password}
              isVisible={info.isItSignIn}
            />
          </label>
          {info.isItSignIn && (
            <label className="authentication__checkbox-container">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked((prev) => !prev);
                }}
                className="authentication__invisible-checkbox"
              ></input>
              <span className="authentication__pseudo-checkbox"></span>
              <span className="authentication__checkbox-name">
                Я соглашаюсь{" "}
                <span className="authentication__colored-text">
                  с обработкой персональных данных
                </span>
              </span>
            </label>
          )}
          {!info.isItSignIn && (
            <Link
              to="/change-password"
              className="authentication__colored-text authentication__link"
            >
              Забыли пароль?
            </Link>
          )}
          <button
            type="submit"
            disabled={
              (info.isItSignIn && (!isValid || !isChecked)) ||
              (!info.isItSignIn && !isValid)
            }
            className={`btn authentication__button ${
              (info.isItSignIn && (!isValid || !isChecked)) ||
              (!info.isItSignIn && !isValid)
                ? "authentication__button_type_disabled"
                : ""
            }`}
          >
            {info.buttonText}
          </button>
        </form>
        {!info.isItSignIn && (
          <button
            className={`btn authentication__button`}
            style={{ margin: 0 }}
            onClick={() => navigate("/signin")}
          >
            зарегистрироваться
          </button>
        )}
        {!info.isItSignIn && isDirectedFromThisSite && (
          <div className="authentication__login-container">
            <p className="authentication__login-text">Войти с помощью</p>
            <div className="authentication__login-icons">
              <Vkontakte />
              <Telegram />
              <Yandex />
              <Google />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AuthenticationForm;
