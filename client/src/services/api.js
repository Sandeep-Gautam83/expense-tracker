const API_BASE_URL = "http://localhost:5000/api";

/**
 * Generate a UUID v4 for idempotency keys
 */
export const generateIdempotencyKey = () => {
  return crypto.randomUUID();
};

/**
 * Fetch all expenses with optional filtering and sorting
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.sort - Sort order (date_desc or date_asc)
 */
export const getExpenses = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.category) {
    queryParams.append("category", params.category);
  }

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  const url = `${API_BASE_URL}/expenses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const data = await response.json();
  return data.data;
};

/**
 * Create a new expense
 */
export const createExpense = async (expenseData, idempotencyKey) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create expense");
  }

  return data.data;
};
