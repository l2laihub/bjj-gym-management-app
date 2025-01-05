import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: CardProps) => {
  return (
    <div className={cn("p-4 sm:p-6 border-b", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }: CardProps) => {
  return (
    <div className={cn("p-4 sm:p-6", className)}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      "p-4 sm:p-6 border-t bg-gray-50",
      className
    )}>
      {children}
    </div>
  );
};