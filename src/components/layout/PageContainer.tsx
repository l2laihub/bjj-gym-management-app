import React from 'react';
import { cn } from '../../utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn(
      "min-h-screen w-full",
      "pt-20 lg:pt-8 pb-8", // Account for mobile header
      "px-4 lg:px-8",
      className
    )}>
      <div className="max-w-[1400px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;