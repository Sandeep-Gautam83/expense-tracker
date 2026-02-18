import { EXPENSE_CATEGORIES } from "../constants/categories";

const ExpenseControls = ({
  filterCategory,
  onFilterChange,
  sortOrder,
  onSortChange,
  total,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side: Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Category Filter */}
          <div className="flex-1">
            <label
              htmlFor="filter-category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Category
            </label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Toggle */}
          <div className="flex-1">
            <label
              htmlFor="sort-order"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort by Date
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Right side: Total */}
        <div className="flex items-center justify-center md:justify-end">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md">
            <div className="text-sm font-medium opacity-90">Total</div>
            <div className="text-2xl font-bold">{total}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseControls;
