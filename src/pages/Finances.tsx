import { FC } from 'react';
import FinancesHeader from '../components/finances/FinancesHeader';
import FinancialStats from '../components/finances/FinancialStats';
import RevenueChart from '../components/finances/RevenueChart';
import ExpenseBreakdown from '../components/finances/ExpenseBreakdown';
import TransactionHistory from '../components/finances/TransactionHistory';
import { FinanceProvider } from '../contexts/FinanceContext';

const Finances: FC = () => {
  return (
    <FinanceProvider>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <FinancesHeader />
          <FinancialStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart />
            <ExpenseBreakdown />
          </div>
          <TransactionHistory />
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Finances;