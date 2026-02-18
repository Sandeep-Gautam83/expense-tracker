import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { rupeesToPaise } from "../utils/currency";
import { createExpense, generateIdempotencyKey } from "../services/api";

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    generateIdempotencyKey(),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
    // Clear field-specific error
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    // Validate amount
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    // Validate description
    if (!formData.description || formData.description.trim().length < 3) {
      errors.description = "Description must be at least 3 characters";
    } else if (formData.description.length > 200) {
      errors.description = "Description must not exceed 200 characters";
    }

    // Validate date (not in future)
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      errors.date = "Date cannot be in the future";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert rupees to paise for API
      const expenseData = {
        amount: rupeesToPaise(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      const newExpense = await createExpense(expenseData, idempotencyKey);

      // Reset form on success
      setFormData({
        amount: "",
        category: "Food",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      // Generate new idempotency key for next submission
      setIdempotencyKey(generateIdempotencyKey());

      // Notify parent component
      if (onExpenseAdded) {
        onExpenseAdded(newExpense);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                fieldErrors.amount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="50.50"
            />
            {fieldErrors.amount && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.amount}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={200}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              fieldErrors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Lunch at restaurant"
          />
          {fieldErrors.description && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            required
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              fieldErrors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.date && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.date}</p>
          )}
        </div>
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
