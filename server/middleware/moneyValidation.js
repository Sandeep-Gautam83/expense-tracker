/**
 * Middleware to validate and convert money amounts
 * - Validates amount is a positive number
 * - Ensures amount represents paise (integer)
 * - Prevents floating-point errors
 */
const validateMoney = (req, res, next) => {
  if (req.method === "POST" && req.body.amount !== undefined) {
    const { amount } = req.body;

    // Check if amount is provided
    if (amount === null || amount === undefined || amount === "") {
      return res.status(400).json({
        success: false,
        error: "Amount is required",
      });
    }

    // Convert to number if string
    const numAmount = Number(amount);

    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a valid number",
      });
    }

    // Check if negative
    if (numAmount < 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be non-negative",
      });
    }

    // Check if amount is already in paise (integer) or needs conversion
    // If it's a whole number > 100, assume it's already in paise
    // If it has decimals or is < 100, assume it's in rupees
    if (!Number.isInteger(numAmount)) {
      return res.status(400).json({
        success: false,
        error:
          "Amount must be provided in paise (integer). For ₹50.50, send 5050",
      });
    }

    // Store the validated amount
    req.body.amount = numAmount;
  }

  next();
};

/**
 * Utility function to convert rupees to paise (for frontend)
 * @param {number} rupees - Amount in rupees
 * @returns {number} - Amount in paise
 */
const rupeesToPaise = (rupees) => {
  return Math.round(rupees * 100);
};

/**
 * Utility function to convert paise to rupees (for display)
 * @param {number} paise - Amount in paise
 * @returns {number} - Amount in rupees
 */
const paiseToRupees = (paise) => {
  return paise / 100;
};

/**
 * Format amount as Indian Rupees
 * @param {number} paise - Amount in paise
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (paise) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paiseToRupees(paise));
};

module.exports = {
  validateMoney,
  rupeesToPaise,
  paiseToRupees,
  formatCurrency,
};
