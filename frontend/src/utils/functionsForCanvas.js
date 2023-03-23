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
export const calculateMarginX = (width, fontPosition, textMargin) => {
  if (fontPosition === "start") {
    return textMargin;
  } else if (fontPosition === "end") {
    return width - textMargin;
  } else {
    return width / 2;
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
  // First, start by splitting all of our text into words, but splitting it into an array split by spaces
  let words = text.split(" ");
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
  // canvas,
  offsetY,
  textMarginYBottom,
  textMarginYTop,
  lineTop,
  lineBottom,
  marginX,
  textWidth,
  textValues
) => {
  if (t[t.length - 1] === " ") {
    // если последний символ - пробел (не поставленный пользователем) - убрать его из строки (важно, чтобы не было подчеркивания или выделения пустоты)
    t = t.slice(0, t.length - 1);
  }

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

  if (
    (top && (marginY > lineBottom || marginY < lineTop)) ||
    (!top && (marginY < lineTop || marginY > lineBottom))
  ) {
    // ограничение видимости нижних заливки и контура до верхнего края
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "transparent";
  } else {
    ctx.fillStyle = textValues.backColor;
    ctx.strokeStyle = textValues.strokeTextColor;
  }

  addTextBackground(ctx, t, marginX, marginY, lineHeight(textValues.fontSize)); // добавление заливки (default - transparent)

  if (
    (top && (marginY > lineBottom || marginY < lineTop)) ||
    (!top && (marginY < lineTop || marginY > lineBottom))
  ) {
    // ограничение видимости нижнего текста до верхнего края
    ctx.fillStyle = "transparent";
  } else {
    ctx.fillStyle = textValues.fillTextColor; // переключение цвета с заливки на текст
  }

  ctx.lineWidth = 7; // увеличение ширины линии для адекватного контура текста
  ctx.strokeText(t, marginX, marginY); // добавление контура
  ctx.lineWidth = 1; // возвращение ширины линии до стандарта (для подчеркивания и зачеркивания)

  ctx.fillText(t, marginX, marginY, textWidth); // добавление текста построчно

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
