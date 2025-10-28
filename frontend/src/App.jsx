import Dashboard from "./pages/Dashboard";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>💰 Personal Ledger</h1>
        <p>Simple and easy-to-use personal accounting tool</p>
      </header>

      <main className={styles.appMain}>
        <div className={styles.content}>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;
