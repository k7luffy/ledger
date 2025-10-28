import { useState } from "react";
import CustomSelect from "./CustomSelect";
import styles from "./AddTransactionForm.module.css";

const AddTransactionForm = ({ isOpen, onClose, onAddTransaction }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "Food", // Default to first option
    description: "",
  });

  const typeOptions = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];

  const categories = [
    { name: "Food", type: "expense" },
    { name: "Transport", type: "expense" },
    { name: "Shopping", type: "expense" },
    { name: "Entertainment", type: "expense" },
    { name: "Salary", type: "income" },
    { name: "Bonus", type: "income" },
    { name: "Investment", type: "income" },
  ];

  const categoryOptions = categories
    .filter((cat) => cat.type === formData.type)
    .map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      // When type changes, automatically select the first item of the corresponding type as default category
      const newTypeCategories = categories.filter((cat) => cat.type === value);
      const defaultCategory =
        newTypeCategories.length > 0 ? newTypeCategories[0].name : "";

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: defaultCategory,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category) {
      onAddTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        type: "expense",
        amount: "",
        category: "Food", // Also select first item when resetting
        description: "",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Add Transaction</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Type</label>
              <CustomSelect
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                options={typeOptions}
                placeholder=""
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <CustomSelect
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categoryOptions}
                placeholder=""
              />
            </div>

            <div className={styles.formGroup}>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description (Optional)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className={styles.input}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;
