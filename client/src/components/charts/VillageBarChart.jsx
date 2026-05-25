import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VillageBarChart({ data = [] }) {
  const top5 = data.slice(0, 5).map(d => ({ village: d._id, high: d.high, total: d.total }));

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-700 mb-4">High Risk by Village</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={top5}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="village" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="high" fill="#dc2626" name="High Risk" />
          <Bar dataKey="total" fill="#93c5fd" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
