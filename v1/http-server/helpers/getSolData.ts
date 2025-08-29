export function getSolPrice(data: any) {
  if (data.sol_data) {
    return data.sol_data.base_price.int; 
  }
  return null; 
}