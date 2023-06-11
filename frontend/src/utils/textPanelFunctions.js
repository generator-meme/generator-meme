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

// изменение opacity
export const changeOpacity = (opacity, setValues, values) => {
  // регулярное выражение которое возвращает все между последней запятой и последней скобкой включительно
  const regExpFromLastCommaToLastRoundBracket =
    /\,(?=[^,]*$)([\s\S]+?)\)(?=[^)]*$)/g;
  setValues((prev) => ({ ...prev, opacity: opacity }));
  if (values.backColor !== "transparent") {
    // меняем значение opacity (последнее значение в rgba)
    let replacedColor = values.backColor.replace(
      regExpFromLastCommaToLastRoundBracket,
      `,${opacity})`
    );
    setValues((prev) => ({ ...prev, backColor: replacedColor }));
    return;
  }
  return;
};

export const updateTextValues = (setTextValues, textValues, isDeteted) => {
  setTextValues((prev) => ({
    ...prev,
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
  }));
};
