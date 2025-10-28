import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import StatsCards from "../components/StatsCards";
import TransactionList from "../components/TransactionList";
import AddTransactionForm from "../components/AddTransactionForm";
import styles from "./Dashboard.module.css";
import TransactionHeader from "../components/TransactionHeader";

const Dashboard = () => {
  const { transactions, getStatistics, addTransaction } = useTransactions();
  const stats = getStatistics();
  const [showForm, setShowForm] = useState(false);

  const handleAddTransaction = (transactionData) => {
    addTransaction(transactionData);
  };

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <StatsCards stats={stats} />

      <div className={styles.transactionsSection}>
        <TransactionHeader setShowForm={setShowForm} />
        <TransactionList transactions={transactions} />
      </div>

      <AddTransactionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default Dashboard;
