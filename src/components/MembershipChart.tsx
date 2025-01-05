import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', members: 120 },
  { month: 'Feb', members: 128 },
  { month: 'Mar', members: 135 },
  { month: 'Apr', members: 142 },
  { month: 'May', members: 148 },
  { month: 'Jun', members: 156 },
];

const MembershipChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Membership Growth</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#4f46e5"
              fill="#818cf8"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MembershipChart;