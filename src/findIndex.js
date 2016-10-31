module.exports = function (arr, fn) {
  if (Array.isArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      if (fn(arr[i])) return i;
    }
  }

  return -1;
};