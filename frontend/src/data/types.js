// Data structure definitions for the accounting app

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: "income", // Income
  EXPENSE: "expense", // Expense
};

// Transaction record data structure
export const createTransaction = (data) => ({
  id: data.id || Date.now().toString(), // Unique ID
  type: data.type, // Income or expense
  amount: data.amount, // Amount
  category: data.category, // Category
  description: data.description || "", // Description
  date: data.date || new Date().toISOString(), // Date
  createdAt: data.createdAt || new Date().toISOString(), // Creation time
});

// Default categories
export const DEFAULT_CATEGORIES = [
  // Income categories
  { name: "Salary", type: "income", icon: "briefcase", color: "#10b981" },
  { name: "Bonus", type: "income", icon: "gift", color: "#f59e0b" },
  { name: "Investment", type: "income", icon: "trending-up", color: "#8b5cf6" },
  {
    name: "Other Income",
    type: "income",
    icon: "plus-circle",
    color: "#06b6d4",
  },

  // Expense categories
  { name: "Food", type: "expense", icon: "utensils", color: "#ef4444" },
  { name: "Transport", type: "expense", icon: "car", color: "#3b82f6" },
  { name: "Shopping", type: "expense", icon: "shopping-bag", color: "#f97316" },
  {
    name: "Entertainment",
    type: "expense",
    icon: "gamepad-2",
    color: "#ec4899",
  },
  { name: "Healthcare", type: "expense", icon: "heart", color: "#84cc16" },
  { name: "Education", type: "expense", icon: "book", color: "#6366f1" },
  {
    name: "Other Expense",
    type: "expense",
    icon: "minus-circle",
    color: "#6b7280",
  },
];
