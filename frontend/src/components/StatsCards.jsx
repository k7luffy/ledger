import styles from "./StatsCards.module.css";

const StatsCards = ({ stats }) => {
  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <h3>Total Income</h3>
        <p className={styles.income}>${stats.totalIncome.toFixed(2)}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Total Expense</h3>
        <p className={styles.expense}>${stats.totalExpense.toFixed(2)}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Balance</h3>
        <p className={stats.balance >= 0 ? styles.income : styles.expense}>
          ${stats.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
