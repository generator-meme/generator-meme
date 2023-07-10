import React, { useEffect, useState } from "react";
import "./AuthenticationForm.css";
import { useNavigate } from "react-router-dom";
import { prompts } from "./authentificationConstant";

function AuthenticationForm({ info, handleSubmit }) {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  // данные формы и валидация
  const onChange = (event) => {
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

  console.log(isValid, isChecked);

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
    <section className="authentication" aria-label="Аутентификация">
      <div className="authentication__container">
        <h2 className="authentication__title">{info.title}</h2>
        <form className="authentication__form" onSubmit={onSubmit}>
          {info.isItSignIn && (
            <label className="authentication__label">
              <span className="authentication__input-name">
                Имя пользователя
              </span>
              <input
                type="name"
                name="name"
                value={values.name}
                onChange={onChange}
                className={`authentication__input ${
                  errors.name?.length > 1
                    ? "authentication__input_type_error"
                    : ""
                }`}
                placeholder="Valeria Rusakova"
                minLength="3"
                maxLength="40"
                required
              />
              <div
                className={`authentication__input-checked ${
                  !errors.name?.length && values.name.length
                    ? "authentication__input-checked-visible"
                    : ""
                }`}
              ></div>
              <span
                className={`authentication__input-prompt ${
                  errors.name?.length > 1
                    ? "authentication__input-prompt_type_error"
                    : "authentication__input-prompt_type_normal"
                }`}
              >
                {errors.name?.length > 1 ? errors.name : prompts.name}
              </span>
            </label>
          )}
          <label className="authentication__label">
            <span className="authentication__input-name">Почта</span>
            <input
              type="email"
              value={values.email}
              onChange={onChange}
              name="email"
              className={`authentication__input ${
                errors.email?.length > 1
                  ? "authentication__input_type_error"
                  : ""
              }`}
              placeholder="ValeriaRusakova@mail.ru"
              required
            />
            <div
              className={`authentication__input-checked ${
                !errors.email?.length && values.email.length
                  ? "authentication__input-checked-visible"
                  : ""
              }`}
            ></div>
            <span
              className={`authentication__input-prompt ${
                info.isItSignIn && errors.email?.length > 1
                  ? "authentication__input-prompt_type_error"
                  : "authentication__input-prompt_type_normal"
              }`}
            >
              {info.isItSignIn && errors.email?.length > 1
                ? errors.email
                : prompts.email}
            </span>
          </label>
          <label className="authentication__label">
            <span className="authentication__input-name">Пароль</span>
            <input
              type="password"
              value={values.password}
              onChange={onChange}
              name="password"
              className={`authentication__input ${
                errors.password?.length > 1
                  ? "authentication__input_type_error"
                  : ""
              }`}
              placeholder="Ssscrumble_"
              minLength="4"
              maxLength="16"
              required
            />
            <div
              className={`authentication__input-checked ${
                !errors.password?.length && values.password.length
                  ? "authentication__input-checked-visible"
                  : ""
              }`}
            ></div>
            <span
              className={`authentication__input-prompt ${
                info.isItSignIn && errors.password?.length > 1
                  ? "authentication__input-prompt_type_error"
                  : "authentication__input-prompt_type_normal"
              } `}
            >
              {info.isItSignIn && errors.password?.length > 1
                ? errors.password
                : prompts.password}
            </span>
          </label>
          {info.isItSignIn && (
            <label className="authentication__checkbox-container">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked((prev) => !prev);
                }}
                // name="checkbox"
                className="authentication__invisible-checkbox"
                // required
              ></input>
              <span className="authentication__pseudo-checkbox"></span>
              <span className="authentication__checkbox-name">
                Я соглашаюсь{" "}
                <span className="authentication__checkbox-name-colored">
                  с обработкой персональных данных
                </span>
              </span>
            </label>
          )}
          <button
            type="submit"
            disabled={!isValid && !isChecked}
            className={`btn authentication__button ${
              isValid && isChecked ? "" : "authentication__button_type_disabled"
            }`}
          >
            {info.buttonText}
          </button>
        </form>
        {!info.isItSignIn && (
          <button
            className={`bth authentication__button`}
            onClick={() => navigate("/signin")}
          >
            зарегистрироваться
          </button>
        )}
      </div>
    </section>
  );
}

export default AuthenticationForm;
