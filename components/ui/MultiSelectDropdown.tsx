
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelected);
  };

  const handleRemove = (option: string) => {
    onChange(selectedOptions.filter(item => item !== option));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full border border-gray-300 rounded-md p-2 min-h-[42px] flex items-center flex-wrap gap-2 cursor-pointer"
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          selectedOptions.map(option => (
            <span key={option} className="bg-primary-light text-primary-dark text-sm font-medium px-2 py-1 rounded-md flex items-center gap-1">
              {option}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option);
                }}
                className="hover:text-red-500"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </span>
          ))
        )}
        <Icon name="chevronDown" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"/>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {options.map(option => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-2 cursor-pointer hover:bg-primary-light ${selectedOptions.includes(option) ? 'bg-primary-light font-semibold' : ''}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
