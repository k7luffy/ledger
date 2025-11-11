/**
 * Aggregate transaction totals by type.
 * @param {Array<{type: string, amount: number}>} transactions
 */
export const getTransactionStatistics = (transactions = []) => {
  const totals = transactions.reduce(
    (acc, transaction) => {
      const key = transaction.type === "income" ? "income" : "expense";
      const amount = Number(transaction.amount) || 0;

      acc[key] += amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return {
    totalIncome: totals.income,
    totalExpense: totals.expense,
    balance: totals.income - totals.expense,
  };
};
