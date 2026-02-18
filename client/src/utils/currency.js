/**
 * Convert rupees to paise (for API)
 */
export const rupeesToPaise = (rupees) => {
  return Math.round(parseFloat(rupees) * 100);
};

/**
 * Convert paise to rupees (for display)
 */
export const paiseToRupees = (paise) => {
  return paise / 100;
};

/**
 * Format amount as Indian Rupees
 */
export const formatCurrency = (paise) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paiseToRupees(paise));
};
