import { FC } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../hooks/useFinance';

const RevenueChart: FC = () => {
  const { chartData, isLoading } = useFinance();

  // If chart data isn't loaded yet, show loading state
  if (isLoading || !chartData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses</h2>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 mx-auto"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Transform the chart data to the format expected by the AreaChart component
  const chartFormattedData = chartData.labels.map((label, index) => ({
    month: label,
    revenue: chartData.incomeData[index],
    expenses: chartData.expenseData[index]
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartFormattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              fill="#818cf8"
              fillOpacity={0.2}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              fill="#fca5a5"
              fillOpacity={0.2}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;