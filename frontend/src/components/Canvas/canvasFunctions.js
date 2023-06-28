export const getOffsetY = (element, textsValues, outsideTextHeight) => {
  const difference = element.fontSize - 40;
  let bottomDifference;

  if (window.innerWidth > 700) {
    bottomDifference = 0;
  } else if (window.innerWidth > 570) {
    bottomDifference = 10;
  } else {
    bottomDifference = 20;
  }

  if (element.isOutside) {
    if (element.canvasTop !== null) return element.canvasTop + difference;
    if (element.canvasBottom !== null)
      return element.canvasBottom - bottomDifference;
  } else {
    let pointOY;
    if (element.top !== null) {
      pointOY = element.top;
      return (
        pointOY +
        (textsValues[0].isVisible ? outsideTextHeight : 0) +
        difference
      );
    } else {
      pointOY = element.bottom;
      return (
        pointOY +
        (textsValues[1].isVisible ? outsideTextHeight : 0) -
        bottomDifference
      );
    }
  }
};

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

// отрисовка текст (используется внутри канвас для верхнего и нижнего текста, есть отличия - условия внутри функции, top - булево значение)
export const drawText = (
  string,
  index,
  ctx,
  top,
  canvasHeight,
  offsetY,
  textMarginYBottom,
  textMarginYTop,
  marginX,
  textValues,
  textLength
) => {
  if (string[0] === " ") {
    // если первый символ - пробел - убрать его из строки
    string = string.slice(1);
  }

  if (string[string.length - 1] === " ") {
    // если последний символ - пробел (не поставленный пользователем) - убрать его из строки (важно, чтобы не было подчеркивания или выделения пустоты)
    string = string.slice(0, string.length - 1);
  }

  // t += "\n";

  let marginY;
  if (top) {
    marginY =
      offsetY + index * lineHeight(textValues.fontSize) + textMarginYTop;
  } else {
    // const standartSize =
    //   window.innerWidth > 700 ? 40 : window.innerWidth > 570 ? 30 : 25;
    const sizeIndex =
      textValues.fontSize > 40 ? 0.2 : textValues.fontSize > 30 ? 0.3 : 0.7;
    const sizeDifference =
      textLength === 1
        ? 40 - textValues.fontSize + 5
        : (40 - textValues.fontSize) * sizeIndex;

    marginY =
      canvasHeight -
      offsetY -
      index * lineHeight(textValues.fontSize) -
      textMarginYBottom -
      sizeDifference;
  }

  ctx.fillStyle = textValues.backColor;
  ctx.strokeStyle = textValues.strokeTextColor;

  addTextBackground(
    ctx,
    string,
    marginX,
    marginY,
    lineHeight(textValues.fontSize)
  ); // добавление заливки (default - transparent)

  ctx.fillStyle = textValues.fillTextColor;

  ctx.lineWidth = 7; // увеличение ширины линии для адекватного контура текста
  ctx.strokeText(string, marginX, marginY); // добавление контура
  ctx.lineWidth = 1; // возвращение ширины линии до стандарта (для подчеркивания и зачеркивания)

  ctx.fillText(string, marginX, marginY, textValues.width); // добавление текста построчно

  if (textValues.underline) {
    addLineToText(
      ctx,
      string,
      marginX,
      marginY + 0.125 * textValues.fontSize,
      textValues.fontSize
    ); // отрисовка подчеркивания
  }

  if (textValues.lineThrough) {
    addLineToText(
      ctx,
      string,
      marginX,
      marginY - textValues.fontSize / 4,
      textValues.fontSize
    ); // отрисовка зачеркивания
  }
};
