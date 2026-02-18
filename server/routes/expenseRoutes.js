const express = require('express');
const router = express.Router();
const { createExpense, getExpenses } = require('../controllers/expenseController');

router.route('/').get(getExpenses).post(createExpense);

module.exports = router;
