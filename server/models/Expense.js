const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be non-negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Food",
          "Transport",
          "Entertainment",
          "Shopping",
          "Bills",
          "Healthcare",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries by date
expenseSchema.index({ date: -1 });

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
