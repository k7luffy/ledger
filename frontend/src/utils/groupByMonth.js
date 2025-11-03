// Utility function to group transactions by month

export const groupTransactionsByMonth = (transactions) => {
  const grouped = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    if (!groups[monthKey]) {
      groups[monthKey] = {
        monthKey,
        monthName,
        transactions: [],
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      };
    }

    groups[monthKey].transactions.push(transaction);

    if (transaction.type === "income") {
      groups[monthKey].totalIncome += transaction.amount;
    } else {
      groups[monthKey].totalExpense += transaction.amount;
    }

    groups[monthKey].balance =
      groups[monthKey].totalIncome - groups[monthKey].totalExpense;

    return groups;
  }, {});

  // Convert to array and sort by month (newest first)
  return Object.values(grouped).sort((a, b) =>
    b.monthKey.localeCompare(a.monthKey)
  );
};

// Helper function to format month display
export const formatMonthDisplay = (monthKey) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};
