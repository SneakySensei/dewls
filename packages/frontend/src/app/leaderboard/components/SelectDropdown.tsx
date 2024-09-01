import React, { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectDropdownProps = {
  options: Option[];
  onChange: (selectedValue: string) => void;
  defaultValue?: string;
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  onChange,
  defaultValue,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      className="bg-neutral-800 w-full rounded-md p-2 px-4 border border-neutral-400"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-transparent text-neutral-100 text-body-1 font-normal"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;
