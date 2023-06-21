// вычисление lineHeight
export const lineHeight = (fontSize) => {
  return fontSize * 1.12;
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
