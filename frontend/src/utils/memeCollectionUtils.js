export const getArrayOfNumberPages = (arr, blockPages) => {
  console.log(arr, blockPages);
  let tempArr = arr;
  for (let i = 1; i <= blockPages; i++) {
    tempArr.push(i);
  }
  console.log(tempArr);
  const aa = sliceArrayIntoGroups(tempArr, 5);

  return aa;
};

function sliceArrayIntoGroups(arr, size) {
  if (arr.length === 0) {
    return arr;
  }
  return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
}
