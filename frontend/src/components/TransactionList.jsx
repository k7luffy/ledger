import styles from "./TransactionList.module.css";

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <p className={styles.noTransactions}>
        No transactions yet. Add your first transaction!
      </p>
    );
  }

  return (
    <div className={styles.transactionList}>
      {transactions
        .slice(-5)
        .reverse()
        .map((transaction) => (
          <div key={transaction.id} className={styles.transactionItem}>
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
                  transaction.type === "income" ? styles.income : styles.expense
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
  );
};

export default TransactionList;
