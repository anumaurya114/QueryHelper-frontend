import React, { useState } from 'react';

export interface Option {
  label: string;
  value: string;
}

export const Dropdown: React.FC<{ options: Option[], defaultSelection?:Option, onHandleSelection:(option: Option) => void }> = ({ options, onHandleSelection, defaultSelection }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(defaultSelection || null);

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    onHandleSelection(option);
  };

  return (
    <div className="dropdown">
      <select
        value={defaultSelection ? defaultSelection.value : ''}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const option = options.find((opt) => opt.value === selectedValue);
          if (option) {
            handleSelectOption(option);
          }
        }}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} selected={option.value==(defaultSelection?.value || '')} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};


