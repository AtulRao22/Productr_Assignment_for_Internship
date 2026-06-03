import { useState, useEffect, useRef } from "react";
import "./Select.css";

function Select({ value, onChange, options, placeholder = "Select option", error }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div
        className={`custom-select-trigger ${dropdownOpen ? "open" : ""} ${error ? "error-border" : ""}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className={value ? "selected-value" : "placeholder"}>
          {value || placeholder}
        </span>
        <svg
          className={`custom-select-caret ${dropdownOpen ? "open" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {dropdownOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <div
              key={option}
              className={`custom-select-option ${value === option ? "selected" : ""}`}
              onClick={() => {
                onChange(option);
                setDropdownOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
