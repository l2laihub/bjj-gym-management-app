import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 18500, expenses: 7200 },
  { month: 'Feb', revenue: 19800, expenses: 7800 },
  { month: 'Mar', revenue: 21200, expenses: 8100 },
  { month: 'Apr', revenue: 22100, expenses: 8400 },
  { month: 'May', revenue: 23400, expenses: 8700 },
  { month: 'Jun', revenue: 24500, expenses: 8900 },
];

const RevenueChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
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