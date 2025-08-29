export function fromPreciseInt(intValue: number, decimals = 4) {
  return intValue / Math.pow(10, decimals);
}

export function decimalFormatedPrice(dbResponse: any) {
  const transformed = dbResponse.map((row: any) => ({
    bucket: row.bucket,
    open: fromPreciseInt(parseInt(row.open, 10)),
    high: fromPreciseInt(parseInt(row.high, 10)),
    low: fromPreciseInt(parseInt(row.low, 10)),
    close: fromPreciseInt(parseInt(row.close, 10)),
  }));
  return transformed;
}
