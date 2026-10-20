// Formats an amount held in kobo (the smallest unit) as naira for display.
export function formatPrice(kobo) {
  return "₦" + (kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
