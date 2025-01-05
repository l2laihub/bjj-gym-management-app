import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Rent', value: 4500, color: '#4f46e5' },
  { name: 'Equipment', value: 1800, color: '#06b6d4' },
  { name: 'Utilities', value: 900, color: '#8b5cf6' },
  { name: 'Marketing', value: 700, color: '#10b981' },
  { name: 'Insurance', value: 600, color: '#f59e0b' },
  { name: 'Other', value: 400, color: '#6b7280' },
];

const ExpenseBreakdown = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;