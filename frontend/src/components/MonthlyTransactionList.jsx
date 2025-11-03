import { useState } from "react";
import { groupTransactionsByMonth } from "../utils/groupByMonth";
import { ChevronDown, ChevronRight } from "lucide-react";
import styles from "./MonthlyTransactionList.module.css";

const MonthlyTransactionList = ({ transactions }) => {
  const monthlyGroups = groupTransactionsByMonth(transactions);
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const [closingMonths, setClosingMonths] = useState(new Set());

  const toggleMonth = (monthKey) => {
    const isCurrentlyExpanded = expandedMonths.has(monthKey);

    if (isCurrentlyExpanded) {
      // Start closing animation
      setClosingMonths((prev) => new Set(prev).add(monthKey));

      // Remove from expanded after animation completes
      setTimeout(() => {
        setExpandedMonths((prev) => {
          const newSet = new Set(prev);
          newSet.delete(monthKey);
          return newSet;
        });
        setClosingMonths((prev) => {
          const newSet = new Set(prev);
          newSet.delete(monthKey);
          return newSet;
        });
      }, 300); // Match the slideUp animation duration
    } else {
      // Add to expanded immediately
      setExpandedMonths((prev) => new Set(prev).add(monthKey));
    }
  };

  if (transactions.length === 0) {
    return (
      <p className={styles.noTransactions}>
        No transactions yet. Add your first transaction!
      </p>
    );
  }

  return (
    <div className={styles.monthlyList}>
      {monthlyGroups.map((month) => {
        const isExpanded = expandedMonths.has(month.monthKey);
        const isClosing = closingMonths.has(month.monthKey);
        const shouldShowContent = isExpanded || isClosing;

        return (
          <div key={month.monthKey} className={styles.monthGroup}>
            <div
              className={styles.monthHeader}
              onClick={() => toggleMonth(month.monthKey)}
            >
              <div className={styles.monthHeaderLeft}>
                <button
                  className={`${styles.toggleButton} ${
                    isExpanded ? styles.rotated : ""
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
                <h4 className={styles.monthName}>{month.monthName}</h4>
                <span className={styles.transactionCount}>
                  ({month.transactions.length} transactions)
                </span>
              </div>
              <div className={styles.monthStats}>
                <span className={styles.income}>
                  +${month.totalIncome.toFixed(2)}
                </span>
                <span className={styles.expense}>
                  -${month.totalExpense.toFixed(2)}
                </span>
                <span
                  className={
                    month.balance >= 0
                      ? styles.positiveBalance
                      : styles.negativeBalance
                  }
                >
                  ${month.balance.toFixed(2)}
                </span>
              </div>
            </div>

            {shouldShowContent && (
              <div
                className={`${styles.transactionsList} ${
                  isClosing ? styles.closing : ""
                }`}
              >
                {month.transactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className={styles.transactionItem}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <div className={styles.transactionInfo}>
                        <span
                          className={`${styles.transactionType} ${
                            styles[transaction.type]
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                        </span>
                        <div className={styles.transactionDetails}>
                          <span className={styles.transactionCategory}>
                            {transaction.category}
                          </span>
                          <span className={styles.transactionDescription}>
                            {transaction.description}
                          </span>
                        </div>
                      </div>
                      <div className={styles.transactionAmount}>
                        <span
                          className={
                            transaction.type === "income"
                              ? styles.income
                              : styles.expense
                          }
                        >
                          ${transaction.amount.toFixed(2)}
                        </span>
                        <span className={styles.transactionDate}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyTransactionList;
