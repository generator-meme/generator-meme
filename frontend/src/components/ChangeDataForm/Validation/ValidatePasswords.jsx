import * as yup from "yup";

export const validationPassSchema = yup.object().shape({
  name_pass: yup
    .string()
    .min(5, "Слишком короткий")
    .max(16, "Слишком длинный"),
  new_pass: yup
    .string()
    .min(5, "Слишком короткий")
    .max(16, "Слишком длинный")
    .required("Пароль не соответствует требованиям"),
});
