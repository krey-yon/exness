export function toPreciseInt(value: number, decimals = 4) {
  const factor = Math.pow(10, decimals);
  const intValue = Math.round(Number(value) * factor);
  return { int: intValue, decimals };
}

// function fromPreciseInt(intValue, decimals = 4) {
//   return intValue / Math.pow(10, decimals);
// }
