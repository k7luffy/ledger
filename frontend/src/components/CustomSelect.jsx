import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync external value changes
  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const handleOptionClick = (optionValue) => {
    setSelectedValue(optionValue);
    onChange({
      target: {
        name: name,
        value: optionValue,
      },
    });
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <div
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectedValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                selectedValue === option.value ? styles.selected : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
