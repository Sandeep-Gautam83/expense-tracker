const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generate a UUID v4 for idempotency keys
 */
export const generateIdempotencyKey = () => {
  return crypto.randomUUID();
};

/**
 * Fetch all expenses
 */
export const getExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  const data = await response.json();
  return data.data;
};

/**
 * Create a new expense
 */
export const createExpense = async (expenseData, idempotencyKey) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify(expenseData)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create expense');
  }
  
  return data.data;
};
