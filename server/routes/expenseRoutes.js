const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
} = require("../controllers/expenseController");
const { validateMoney } = require("../middleware/moneyValidation");

// Apply money validation to POST requests
router.route("/").get(getExpenses).post(validateMoney, createExpense);

module.exports = router;
