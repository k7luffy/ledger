import { useState, useEffect } from "react";
import { createTransaction, DEFAULT_CATEGORIES } from "../data/types";

// Custom hook for managing transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories] = useState(DEFAULT_CATEGORIES);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("ledger-transactions");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("ledger-transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add a new transaction
  const addTransaction = (transactionData) => {
    const newTransaction = createTransaction(transactionData);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  // Delete a transaction
  const deleteTransaction = (transactionId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
  };

  // Calculate statistics
  const getStatistics = () => {
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
    };
  };

  return {
    transactions,
    categories,
    addTransaction,
    deleteTransaction,
    getStatistics,
  };
};
