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

// расчет координаты по оси X текста
export const calculateMarginX = (width, fontPosition, textMargin, offsetX) => {
  if (fontPosition === "start") {
    return textMargin + offsetX;
  } else if (fontPosition === "end") {
    return width - textMargin + offsetX;
  } else {
    return width / 2 + offsetX;
  }
};

// export const calculateMarginX = (canvas, fontPosition, offsetX, textMargin) => {
//   if (fontPosition === "start") {
//     return textMargin + offsetX;
//   } else if (fontPosition === "end") {
//     return canvas.width - offsetX - textMargin;
//   } else {
//     return canvas.width / 2;
//   }
// };

// отрисовка подчеркивания или зачеркивания
export const addLineToText = (ctx, text, x, y, fontSize) => {
  let metrics = ctx.measureText(text); // вычисление метрик текста (нас интересует ширина)

  switch (
    ctx.textAlign // вычисление начальной координаты OX
  ) {
    case "center":
      x -= metrics.width / 2;
      break;
    case "end":
      x -= metrics.width;
      break;
    default:
      x += 0;
  }

  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = ctx.fillStyle; // цвет линии - цвет шрифта
  ctx.lineWidth = Math.ceil(fontSize * 0.05); // вычисление ширины линии в зависимости от размера шрифта
  ctx.moveTo(x, y);
  ctx.lineTo(x + metrics.width, y);
  ctx.stroke();
  ctx.restore();
};

// отрисовка заливки фона текста
export const addTextBackground = (ctx, text, x, y, lineHeight) => {
  let metrics = ctx.measureText(text); // вычисление метрик текста (нас интересует ширина)

  switch (
    ctx.textAlign // вычисление начальной координаты OX
  ) {
    case "center":
      x -= metrics.width / 2 + 5;
      break;
    case "end":
      x -= metrics.width + 5;
      break;
    default:
      x -= 5;
  }

  y -= 0.78125 * lineHeight; // вычисление начальной коодинаты OY

  if (metrics.width > 0) {
    ctx.fillRect(x, y, metrics.width + 10, 1.1 * lineHeight);
  }
};

// вычисление lineHeight
export const lineHeight = (fontSize) => {
  return fontSize * 1.12;
};

// функция добавления "/n" к строкам, если они не вмещаются в допустимую ширину
export const wrapText = (ctx, text, maxWidth) => {
  let textArr = text.split("\n"); // добавление пробела после каждого знака переноса
  for (let i = 0; i < textArr.length - 1; i++) {
    textArr[i] += "\n ";
  }
  let textWithSpace = textArr.join("");

  // First, start by splitting all of our text into words, but splitting it into an array split by spaces
  let words = textWithSpace.split(" ");
  let line = ""; // This will store the text of the current line
  let testLine = ""; // This will store the text when we add a word, to test if it's too long
  let lineArray = []; // This is an array of lines, which the function will return

  // Lets iterate over each word
  for (var n = 0; n < words.length; n++) {
    // Create a test line, and measure it..
    testLine += `${words[n]} `;
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;

    // If the width of this test line is more than the max width
    if (testWidth > maxWidth && n > 0) {
      // Then the line is finished, add to line '\n' and push the current line into "lineArray"
      line += "\n";
      lineArray.push(line);
      // Update line and test line to use this word as the first word on the next line
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else if (words[n].includes("\n")) {
      // проверка на наличие переноса в слове, обнуление line и testLine в этом случае
      line += `${words[n]} `;
      lineArray.push(line);
      line = "";
      testLine = "";
    } else {
      // If the test line is still less than the max width, then add the word to the current line
      line += `${words[n]} `;
    }

    // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
    if (n === words.length - 1) {
      lineArray.push(line);
    }
  }
  // Return the new string
  return lineArray.join("");
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

// замена кодировки цвета
const hexToRgb = (hex) => {
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

// изменение цвета фона текста
export const changeBackColor = (color, setValues, values) => {
  if (color !== "transparent") {
    setValues((prev) => ({
      ...prev,
      backColor: `rgba(${hexToRgb(color)}, ${values.opacity})`,
    }));
    return;
  }
  setValues((prev) => ({ ...prev, backColor: color }));
  return;
};

// отрисовка текст (используется внутри канвас для верхнего и нижнего текста, есть отличия - условия внутри функции, top - булево значение)
export const drawText = (
  t,
  i,
  ctx,
  top,
  canvasHeight,
  offsetY,
  textMarginYBottom,
  textMarginYTop,
  // lineTop,
  // lineBottom,
  marginX,
  // textWidth,
  textValues
  // canvasTextVisible
) => {
  if (t[0] === " ") {
    // если первый символ - пробел - убрать его из строки
    t = t.slice(1);
  }

  if (t[t.length - 1] === " ") {
    // если последний символ - пробел (не поставленный пользователем) - убрать его из строки (важно, чтобы не было подчеркивания или выделения пустоты)
    t = t.slice(0, t.length - 1);
  }

  // t += "\n";

  let marginY;
  if (top) {
    marginY = offsetY + i * lineHeight(textValues.fontSize) + textMarginYTop;
  } else {
    marginY =
      canvasHeight -
      offsetY -
      i * lineHeight(textValues.fontSize) -
      textMarginYBottom;
  }

  ctx.fillStyle = textValues.backColor;
  ctx.strokeStyle = textValues.strokeTextColor;

  addTextBackground(ctx, t, marginX, marginY, lineHeight(textValues.fontSize)); // добавление заливки (default - transparent)

  ctx.fillStyle = textValues.fillTextColor;

  // if (canvasTextVisible) { // если будем отправлять текст в канвас перед генерацией мема
  //   ctx.fillStyle = textValues.fillTextColor;
  // } else {
  //   ctx.fillStyle = "transparent";
  // }

  ctx.lineWidth = 7; // увеличение ширины линии для адекватного контура текста
  ctx.strokeText(t, marginX, marginY); // добавление контура
  ctx.lineWidth = 1; // возвращение ширины линии до стандарта (для подчеркивания и зачеркивания)

  ctx.fillText(t, marginX, marginY, textValues.width); // добавление текста построчно

  if (textValues.underline) {
    addLineToText(
      ctx,
      t,
      marginX,
      marginY + 0.125 * textValues.fontSize,
      textValues.fontSize
    ); // отрисовка подчеркивания
  }

  if (textValues.lineThrough) {
    addLineToText(
      ctx,
      t,
      marginX,
      marginY - textValues.fontSize / 4,
      textValues.fontSize
    ); // отрисовка зачеркивания
  }
};

// export const moveTextarea = (e) => {
//   const textMoving = document.getElementById("textMoving");
//   if (!e.target.contains(textMoving)) return;
//   let target = e.target;

//   target.moving = true;

//   if (e.clientX) {
//     target.oldX = e.clientX;
//     target.oldY = e.clientY;
//   } else {
//     target.oldX = e.touches[0].clientX;
//     target.oldY = e.touches[0].clientY;
//   }

//   target.oldLeft =
//     window.getComputedStyle(target).getPropertyValue("left").split("px")[0] * 1;
//   target.oldTop =
//     window.getComputedStyle(target).getPropertyValue("top").split("px")[0] * 1;

//   const dr = (event) => {
//     event.preventDefault();
//     if (!target.moving) {
//       return;
//     }
//     if (event.clientX) {
//       target.distX = event.clientX - target.oldX;
//       target.distY = event.clientY - target.oldY;
//     } else {
//       target.distX = event.touches[0].clientX - target.oldX;
//       target.distY = event.touches[0].clientY - target.oldY;
//     }

//     target.style.left = target.oldLeft + target.distX + "px";
//     target.style.top = target.oldTop + target.distY + "px";
//   };

//   target.onmousemove = dr;
//   target.ontouchmove = dr;

//   const endDrag = () => {
//     target.moving = false;
//   };
//   target.onmouseup = endDrag;
//   target.ontouchend = endDrag;
// };

// export const pickup = (e, offset, setIsDown) => {
//   setIsDown(true);
//   if (e.clientX) {
//     offset = [e.target.offsetLeft - e.clientX, e.target.offsetTop - e.clientY];
//   } else if (e.touches) {
//     // for touch devices, use 1st touch only
//     offset = [
//       e.target.offsetLeft - e.touches[0].pageX,
//       e.target.offsetTop - e.touches[0].pageY,
//     ];
//   }
// };

// export const move = (e, offset, isDown, position) => {
//   if (isDown) {
//     if (e.clientX) {
//       position = { x: e.clientX, y: e.clientY };
//     } else if (e.touches) {
//       position = { x: e.touches[0].pageX, y: e.touches[0].pageY };
//     }
//     e.target.style.left = position.x + offset[0] + "px";
//     e.target.style.top = position.y + offset[1] + "px";
//   }
// };

// export const drop = (e, offset, setIsDown, position) => {
//   setIsDown(false);
//   e.target.style.left = position.x + offset[0] + "px";
//   e.target.style.top = position.y + offset[1] + "px";
// };

export const move = (e, textValues, setTextValues) => {
  if (textValues === "") return;
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

  setTextValues((prev) => ({
    ...prev,
    top: prev.top !== null ? newY : null,
    left: newX,
    bottom: prev.bottom !== null ? -newY : null,
  }));
};
