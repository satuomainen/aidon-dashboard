export function last(arr) {
  if (!arr || !Array.isArray(arr) || arr.length < 1) {
    return null;
  }

  return arr[arr.length - 1];
}
