import { formatCurrency } from "../utils/currency";
import { EXPENSE_CATEGORIES } from "../constants/categories";

const SummaryView = ({ expenses }) => {
  // Calculate total per category
  const categoryTotals = EXPENSE_CATEGORIES.map((category) => {
    const total = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return { category, total };
  }).filter((item) => item.total > 0); // Only show categories with expenses

  // Calculate grand total
  const grandTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Expense Summary</h2>

      <div className="space-y-3">
        {categoryTotals.map(({ category, total }) => (
          <div key={category} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-3">
                {category}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(total)}
              </span>
              <div className="ml-3 w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(total / grandTotal) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {((total / grandTotal) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800">Grand Total</span>
        <span className="text-2xl font-bold text-blue-600">
          {formatCurrency(grandTotal)}
        </span>
      </div>
    </div>
  );
};

export default SummaryView;
