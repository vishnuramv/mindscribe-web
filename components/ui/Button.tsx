import React from 'react';

// Fix: Add a 'size' prop to ButtonProps to allow for different button sizes.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm';
  children: React.ReactNode;
}

// Fix: Convert Button to a forwardRef component to allow refs to be passed to the underlying <button> element.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, className = '', variant = 'primary', size = 'default', ...props }, ref) => {
  // Fix: Removed size-related styles from base classes.
  const baseClasses = 'rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary',
  };

  // Fix: Added size classes to handle different button sizes.
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-2 py-1 text-xs',
  };

  const disabledClasses = 'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed';

  return (
    <button
      ref={ref}
      // Fix: Apply size classes.
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
