import React from 'react';
import { cn } from '../../utils/cn';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  children: React.ReactNode;
}

const AuthButton = ({
  variant = 'primary',
  loading,
  children,
  className,
  ...props
}: AuthButtonProps) => {
  return (
    <button
      className={cn(
        "w-full flex justify-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === 'primary' 
          ? "border-transparent text-white bg-indigo-600 hover:bg-indigo-700" 
          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
        className
      )}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  );
};

export default AuthButton;