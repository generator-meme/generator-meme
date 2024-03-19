export const getArrayOfNumberPages = (arr, blockPages) => {
  let tempArr = arr;
  for (let i = 1; i <= blockPages; i++) {
    tempArr.push(i);
  }
  return sliceArrayIntoGroups(tempArr, 5);
};

function sliceArrayIntoGroups(arr, size) {
  if (arr.length === 0) {
    return arr;
  }
  return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
}
