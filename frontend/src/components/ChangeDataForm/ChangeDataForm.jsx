import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "./ChangeDataForm.css";
import FormPrompt from "../FormPrompt/FormPrompt";
import { authorisation } from "../../utils/autorisation";
import { setNewUsername } from "../../services/actions/userActions";
import { getCookie } from "../../utils/cookie";
import { ReactComponent as Back } from "../../images/go-backwards.svg";

import { validationNameSchema } from "./Validation/ValidateName";
import { validationPassSchema } from "./Validation/ValidatePasswords";

import { Formik, Form, Field, ErrorMessage } from "formik";

const ChangeDataForm = ({ info }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userInfo);

  const [newName, setNewName] = useState(""); //так же используется для старого пароля
  const [newPass, setNewPass] = useState("");

  const [errors_back, setErrors] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const handleChangingNewPass = async (event) => {
    const { name, value, validationMessage } = event.target;
    const isValidLocal = await schema.isValid({ new_pass: value });
    // console.log(isValidLocal);
    setIsValid(isValidLocal);
    setNewPass(value);
  };
  const schema = info === "name" ? validationNameSchema : validationPassSchema;

  const handleChangingNamePass = async (event) => {
    const { name, value, validationMessage } = event.target;
    let isValidLocal;
    if (info === "name") {
      isValidLocal = await schema.isValid({ name_pass: value });
    } else {
      isValidLocal = true;
    }
    // console.log(isValidLocal);
    setIsValid(isValidLocal);
    setNewName(value);
  };

  const onFormSubmit = (event) => {
    if (isValid) {
      if (info === "name") {
        changeName(event);
      } else {
        changePass(event);
      }
    }
  };
  const changePass = async (event) => {
    try {
      event.preventDefault();
      // console.log("started pass request");
      const savedToken = getCookie("token");
      const userInfo = await authorisation.setPassword(
        newName,
        newPass,
        savedToken
      );
      // console.log("all good");
      setIsSubmited(true);
    } catch (err) {
      console.log(err, "checkTokenError");
      const key = Object.keys(err)[0];
      const error = err[key][0];
      setErrors(error);
    }
  };

  const dataForForm = {
    title: info === "name" ? "Изменить имя" : "Изменить пароль",
    placeholder:
      info === "name" ? "Введите новое имя" : "Введите старый пароль",
    placeholderPass: "Введите новый пароль",
  };
  const changeName = async (event) => {
    try {
      // event.preventDefault();
      // console.log("started name request");
      const email = userData.email;
      const savedToken = getCookie("token");
      const userInfo = await authorisation.changeName(
        newName,
        email,
        savedToken
      );
      dispatch(setNewUsername(newName));
      // console.log("all good");
      setIsSubmited(true);
    } catch (err) {
      console.log(err, "checkTokenError");
      const key = Object.keys(err)[0];
      const error = err[key][0];
      setErrors(error);
    }
  };
  return (
    <>
      <main className="authentication">
        <button className="button-back" onClick={() => navigate("/me")}>
          <Back />
          Назад
        </button>
        <div className="authentication__container">
          <h2 className="authentication__title">{dataForForm.title}</h2>
          <Formik
            initialValues={{
              name_pass: newName,
              new_pass: newPass,
            }}
            validationSchema={schema}
          >
            {({ errors, touched }) => {
              return (
                <Form className="authentication__form" onSubmit={onFormSubmit}>
                  <Field
                    name="name_pass"
                    placeholder={dataForForm.placeholder}
                    onChange={handleChangingNamePass}
                    value={newName}
                    className={"authentication__input"}
                  />
                  {!isValid && newName !== "" ? (
                    <ErrorMessage
                      name="name_pass"
                      component="div"
                      className="authentication__input-prompt_type_error"
                    />
                  ) : (
                    <></>
                  )}
                  {info === "pass" && (
                    <>
                      <Field
                        name="new_pass"
                        placeholder={dataForForm.placeholderPass}
                        onChange={handleChangingNewPass}
                        value={newPass}
                        className={"authentication__input"}
                      />
                      {!isValid && newPass !== "" ? (
                        <ErrorMessage
                          name="new_pass"
                          component="div"
                          className="authentication__input-prompt_type_error"
                        />
                      ) : (
                        <>
                          Введите новый пароль. Любые символы в количестве от
                          5-ти и больше
                        </>
                      )}
                    </>
                  )}
                  {errors_back ? (
                    <div className="authentication__input-prompt_type_error">
                      {errors_back}
                    </div>
                  ) : (
                    <></>
                  )}

                  <button className="btn authentication__button" type="submit">
                    сохранить
                  </button>
                </Form>
              );
            }}
          </Formik>
          {isSubmited && <div>Все супер!</div>}
        </div>
      </main>
    </>
  );
};
export default ChangeDataForm;
