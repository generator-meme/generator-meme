import React, { useEffect, useState } from "react";
import "./ResetForm.css";
import FormPrompt from "../FormPrompt/FormPrompt";
import ButtonBack from "../ButtonBack/ButtonBack";

function ResetForm({ info, handleSubmit }) {
  const [values, setValues] = useState({ [info.inputName]: "" });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    handleSubmit(event, values[info.inputName], setValues, setErrors);
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubmitted) {
      setValues(() => ({ [info.inputName]: "" }));
      setIsValid(false);
    }
    return setIsSubmitted(false);
  }, [isSubmitted]);

  return (
    <main className="reset-form">
      <ButtonBack />
      <div className="reset-form__container">
        <h2 className="reset-form__title">{info.title}</h2>
        <form className="reset-form__form" onSubmit={onSubmit}>
          <label>
            {info.fieldName && (
              <span className="reset-form__input-name">{info.fieldName}</span>
            )}
            <input
              type={info.type}
              value={values[info.inputName]}
              onChange={onChange}
              name={info.inputName}
              className={`reset-form__input ${
                errors[[info.inputName]]?.length > 1
                  ? "reset-form__input_type_error"
                  : ""
              }`}
              pattern={
                info.inputName === "password"
                  ? "[^А-Я^а-я]{5,16}"
                  : // eslint-disable-next-line no-useless-escape
                    "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"
              }
              //   placeholder={}
              required
            />
            <FormPrompt
              errorName={errors[info.inputName]}
              spanName={info.prompt}
              isVisible={info.prompt}
            />
          </label>
          <button
            type="submit"
            disabled={!isValid}
            className={`btn reset-form__button ${
              isValid ? "" : "reset-form__button_type_disabled"
            }`}
          >
            {info.buttonText}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetForm;
