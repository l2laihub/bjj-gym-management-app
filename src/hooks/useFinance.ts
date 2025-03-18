import { useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  
  return context;
};
