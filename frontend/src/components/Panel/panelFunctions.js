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
