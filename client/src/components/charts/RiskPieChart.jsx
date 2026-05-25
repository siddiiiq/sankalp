import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#dc2626', '#d97706', '#16a34a'];

export default function RiskPieChart({ data }) {
  const chartData = [
    { name: 'High', value: data?.highRisk || 0 },
    { name: 'Medium', value: data?.mediumRisk || 0 },
    { name: 'Low', value: data?.lowRisk || 0 }
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-700 mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
