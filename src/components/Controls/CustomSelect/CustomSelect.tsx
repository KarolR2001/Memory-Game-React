import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomSelect.scss';

interface CustomSelectProps {
  options: { value: string; label: string; disabled?: boolean }[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

const CustomSelect = ({ options, defaultValue, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    if (!options.find((opt) => opt.value === value)?.disabled) {
      setSelectedValue(value);
      onChange(value);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="select-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{options.find((opt) => opt.value === selectedValue)?.label || 'Level'}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`} />
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            className="select-options"
            initial={{ height: 0, opacity: 0, scaleY: 0.8, transformOrigin: 'top' }}
            animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0.8, transformOrigin: 'top' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`option ${option.disabled ? 'disabled' : ''} ${
                  option.value === selectedValue ? 'selected' : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;