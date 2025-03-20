import { ReactNode } from 'react';
import './CustomButton.scss';

interface CustomButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'light';
}

const CustomButton = ({ onClick, disabled, children, className, variant = 'primary' }: CustomButtonProps) => {
  return (
    <button
      className={`custom-button ${className || ''} ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;