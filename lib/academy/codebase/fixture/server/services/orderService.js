// Money is held in kobo (₦1 = 100 kobo) so totals are whole numbers.
export const DELIVERY_FEE = 150000; // ₦1,500
export const FREE_DELIVERY_FROM = 5000000; // ₦50,000

export function orderTotals(lines) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
}
