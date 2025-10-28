import styles from "./TransactionHeader.module.css";

function TransactionHeader({ setShowForm }) {
  return (
    <div className={styles.transactionsHeader}>
      <h3>Transactions</h3>
      <button className={styles.addButton} onClick={() => setShowForm(true)}>
        <span>+</span>
        Add Transaction
      </button>
    </div>
  );
}

export default TransactionHeader;
