const Expense = require("../models/Expense");

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;

    const expense = await Expense.create({
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses with optional filtering and sorting
// @route   GET /api/expenses?category=Food&sort=date_desc
// @access  Public
const getExpenses = async (req, res, next) => {
  try {
    const { category, sort } = req.query;

    // Build query filter
    const filter = {};
    if (category) {
      filter.category = category;
    }

    // Build sort order
    let sortOrder = { date: -1 }; // Default: newest first
    if (sort === "date_asc") {
      sortOrder = { date: 1 }; // Oldest first
    } else if (sort === "date_desc") {
      sortOrder = { date: -1 }; // Newest first
    }

    const expenses = await Expense.find(filter).sort(sortOrder);

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
};
