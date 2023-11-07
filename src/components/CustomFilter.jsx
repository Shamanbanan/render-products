import React from "react";

const CustomFilter = ({ title, options, selectedOptions, onToggleOption, onClear }) => {
 
    const isAnyOptionSelected = selectedOptions.length > 0;
    const clearButtonClassName = isAnyOptionSelected
      ? "clear-button active"
      : "clear-button";
  
    return (
      <div className="custom-filter">
        <div className="filter-header">
          <label>{title}:</label>
          <button className={clearButtonClassName} onClick={onClear}>
            ✕
          </button>
        </div>
        <ul className="filter-list">
          {options.map((option) => (
            <li key={option}>
              <div
                className={`filter-option ${
                  selectedOptions.includes(option) ? "selected" : ""
                }`}
                onClick={() => onToggleOption(option)}
              >
                {option}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default CustomFilter