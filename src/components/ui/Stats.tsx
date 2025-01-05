import React from 'react';
import { cn } from '../../utils/cn';

interface StatsGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export const StatsGrid = ({ children, columns = 4, className }: StatsGridProps) => {
  return (
    <div className={cn(
      "grid gap-4",
      "grid-cols-1",
      "xs:grid-cols-2",
      columns === 3 && "lg:grid-cols-3",
      columns === 4 && "lg:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = ({ title, value, change, icon, className }: StatCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl p-4 sm:p-6 shadow-sm",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-500 mt-1">{change}</p>
          )}
        </div>
        {icon && (
          <div className="bg-gray-50 p-3 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};