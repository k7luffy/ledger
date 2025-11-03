import { useState, useEffect } from "react";
import { createTransaction, DEFAULT_CATEGORIES } from "../data/types";
import { transactionAPI } from "../services/api";

// Custom hook for managing transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories] = useState(DEFAULT_CATEGORIES);

  // Load data from API on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await transactionAPI.getAll();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions from API:", error);
        setTransactions([]);
      }
    };

    loadTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = createTransaction(transactionData);
      console.log(newTransaction);
      const createdTransaction = await transactionAPI.create(newTransaction);
      setTransactions((prev) => [...prev, createdTransaction]);
    } catch (error) {
      console.error("Failed to create transaction:", error);
      // Fallback to local state if API fails
      const newTransaction = createTransaction(transactionData);
      setTransactions((prev) => [...prev, newTransaction]);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (transactionId) => {
    try {
      await transactionAPI.delete(transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      // Fallback to local state if API fails
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    }
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
