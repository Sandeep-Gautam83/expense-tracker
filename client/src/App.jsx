import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseControls from "./components/ExpenseControls";
import SummaryView from "./components/SummaryView";
import { getExpenses } from "./services/api";
import { formatCurrency } from "./utils/currency";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("date_desc");

  // Fetch expenses when filter or sort changes
  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, sortOrder]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const params = {
        sort: sortOrder,
      };

      if (filterCategory) {
        params.category = filterCategory;
      }

      const data = await getExpenses(params);
      setExpenses(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    // Refetch expenses to maintain correct sorting and filtering
    fetchExpenses();
  };

  const handleFilterChange = (category) => {
    setFilterCategory(category);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
  };

  // Calculate total of visible expenses
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const formattedTotal = formatCurrency(total);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            💰 Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your personal expenses with ease
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Global Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <ExpenseForm onExpenseAdded={handleExpenseAdded} />

        {/* Summary View:  Total per category */}
        {!isLoading && <SummaryView expenses={expenses} />}

        {/* Controls: Filter, Sort, and Total */}
        <ExpenseControls
          filterCategory={filterCategory}
          onFilterChange={handleFilterChange}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          total={formattedTotal}
        />

        {/* Expense List */}
        <ExpenseList expenses={expenses} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm pb-6">
        Built with MERN Stack • Handles network retries and duplicate
        submissions
      </footer>
    </div>
  );
}

export default App;
