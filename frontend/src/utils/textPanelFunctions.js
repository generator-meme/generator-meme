import { fontFamilyOptions } from "./constants.js";

// замена кодировки цвета
export const hexToRgb = (hex) => {
  // проверяем хекс ли это
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // если хекс то возвращаем значение в формате RGB строка вида: "0-255,0-255,0-255" если нет, то возвращаем аргумент без изменений
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )}`
    : hex;
};

export const updateTextValues = (setTextValues, textValues, isDeteted) => {
  setTextValues({
    ...textValues,
    fontSize: 40,
    fontFamily: fontFamilyOptions.roboto,
    selectedOption: 0,
    fontPosition: "center",
    fontWeight: false,
    fontStyle: false,
    fillTextColor: "black",
    strokeTextColor: "transparent",
    underline: false,
    lineThrough: false,
    opacityLevel: 100,
    backColor: "transparent",
    opacity: 1,
    isVisible: isDeteted ? false : true,
    text: isDeteted ? "" : textValues.text,
  });
};
