import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.appMain}>
        <div className={styles.content}>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;
