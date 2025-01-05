import React from 'react';
import FinancesHeader from '../components/finances/FinancesHeader';
import FinancialStats from '../components/finances/FinancialStats';
import RevenueChart from '../components/finances/RevenueChart';
import ExpenseBreakdown from '../components/finances/ExpenseBreakdown';
import TransactionHistory from '../components/finances/TransactionHistory';

const Finances = () => {
  return (
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
  );
};

export default Finances;