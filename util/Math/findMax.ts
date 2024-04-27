export function findMax(arr: any[]) {
  if (arr.length === 0) {
    return null; // If the array is empty, return null
  }
  let maxVal = arr[0]; // Initialize maxVal with the first element of the array
  for (let i = 1; i < arr.length; i++) {
    // Iterate through the array starting from the second element
    if (arr[i] > maxVal) {
      // If the current element is greater than the current maxVal
      maxVal = arr[i]; // Update maxVal
    }
  }
  return maxVal;
}
