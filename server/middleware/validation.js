const { body, validationResult } = require("express-validator");
const { EXPENSE_CATEGORIES } = require("../constants/categories");

/**
 * Validation rules for creating an expense
 */
const validateExpense = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isInt({ min: 1 })
    .withMessage("Amount must be a positive integer (in paise)"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(EXPENSE_CATEGORIES)
    .withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Description must be between 3 and 200 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date")
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (inputDate > today) {
        throw new Error("Date cannot be in the future");
      }
      return true;
    }),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg, // Return first error message
        errors: errors.array(), // Return all errors for debugging
      });
    }
    next();
  },
];

module.exports = {
  validateExpense,
};
