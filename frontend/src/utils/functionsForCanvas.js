// масштабирование изображения для размеров канвас
const fit = (contains) => {
  return (
    parentWidth,
    parentHeight,
    childWidth,
    childHeight,
    scale = 1,
    offsetX = 0.5,
    offsetY = 0.5
  ) => {
    const childRatio = childWidth / childHeight;
    const parentRatio = parentWidth / parentHeight;
    let width = parentWidth * scale;
    let height = parentHeight * scale;

    if (contains ? childRatio > parentRatio : childRatio < parentRatio) {
      height = width / childRatio;
    } else {
      width = height * childRatio;
    }

    return {
      width,
      height,
      offsetX: (parentWidth - width) * offsetX,
      offsetY: (parentHeight - height) * offsetY,
    };
  };
};

export const contain = fit(true);
export const cover = fit(false);

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
