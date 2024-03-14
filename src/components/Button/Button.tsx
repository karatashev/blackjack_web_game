import React from 'react';
import styles from './Button.module.css'; // Import your CSS module

interface ButtonProps {
  className?: string;
  icon?: React.ReactNode;
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  text,
  icon,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
