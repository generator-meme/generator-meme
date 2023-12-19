import * as yup from "yup";

export const validationNameSchema = yup.object().shape({
  name_pass: yup
    .string()
    .min(3, "Имя слишком короткое")
    .max(50, "Имя слишком длинное")
    .required(
      "Имя пользователя не соответствует требованиям"
    ),
});
