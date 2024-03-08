import React from 'react';
import styles from './Button.module.css'; // Import your CSS module

interface ButtonProps {
  className?: string;
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  text,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
