// API service for communicating with JSON Server

const API_BASE_URL = "http://localhost:3001/api";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Transaction API
export const transactionAPI = {
  // Get all transactions
  getAll: () => apiRequest("/transactions"),

  // Get transaction by ID
  getById: (id) => apiRequest(`/transactions/${id}`),

  // Create new transaction
  create: (transactionData) =>
    apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    }),

  // Update transaction
  update: (id, transactionData) =>
    apiRequest(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    }),

  // Delete transaction
  delete: (id) =>
    apiRequest(`/transactions/${id}`, {
      method: "DELETE",
    }),
};

// Category API
export const categoryAPI = {
  // Get all categories
  getAll: () => apiRequest("/categories"),

  // Get category by ID
  getById: (id) => apiRequest(`/categories/${id}`),

  // Create new category
  create: (categoryData) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  // Update category
  update: (id, categoryData) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  // Delete category
  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// Statistics API
export const statisticsAPI = {
  // Get statistics
  getStats: async () => {
    const transactions = await transactionAPI.getAll();

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      transactionCount: transactions.length,
    };
  },
};
