import { fontFamilyOptions } from "./constants.js";

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
