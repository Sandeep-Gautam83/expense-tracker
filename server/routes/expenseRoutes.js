const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
} = require("../controllers/expenseController");
const { validateMoney } = require("../middleware/moneyValidation");
const { validateExpense } = require("../middleware/validation");

// Apply validation and money validation to POST requests
router
  .route("/")
  .get(getExpenses)
  .post(validateExpense, validateMoney, createExpense);

module.exports = router;
