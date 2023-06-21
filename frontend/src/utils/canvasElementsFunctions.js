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

export const pickup = (e, movingElement, values, setValues) => {
  if (!(e.target === movingElement)) return;
  if (values.isMoving) return;
  if (e.nativeEvent.offsetX > values.width - 27) return;

  if (e.clientX) {
    setValues({
      ...values,
      isMoving: true,
      oldX: e.clientX,
      oldY: e.clientY,
    });
  } else {
    setValues({
      ...values,
      isMoving: true,
      oldX: e.touches[0].clientX,
      oldY: e.touches[0].clientY,
    });
  }
  console.log(`pick up ${values.name ? "text" : "image"}`);
};

export const move = (e, textValues, setTextValues) => {
  if (!textValues.isMoving) return;

  let distX;
  let distY;

  if (e.clientX) {
    distX = e.clientX - textValues.oldX;
    distY = e.clientY - textValues.oldY;
  } else {
    distX = e.touches[0].clientX - textValues.oldX;
    distY = e.touches[0].clientY - textValues.oldY;
  }

  const newY = textValues.startTop + distY;
  const newX = textValues.startLeft + distX;

  setTextValues({
    ...textValues,
    top: textValues.top !== null ? newY : null,
    left: newX,
    bottom: textValues.bottom !== null ? -newY : null,
  });
};
