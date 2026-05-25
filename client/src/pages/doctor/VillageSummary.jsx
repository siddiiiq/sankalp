import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import VillageBarChart from '../../components/charts/VillageBarChart';
import { getVillageSummary } from '../../services/screeningService';

export default function VillageSummary() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVillageSummary().then(r => setVillages(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-5">
          <h1 className="text-2xl font-bold">🗺️ Village Summary</h1>

          <VillageBarChart data={villages} />

          <div className="card overflow-x-auto">
            {loading ? <div className="text-center py-8 text-gray-400">Loading...</div> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Village</th>
                    <th className="text-left py-3 px-4">Total Screened</th>
                    <th className="text-left py-3 px-4">🔴 High</th>
                    <th className="text-left py-3 px-4">🟡 Medium</th>
                    <th className="text-left py-3 px-4">🟢 Low</th>
                    <th className="text-left py-3 px-4">High %</th>
                  </tr>
                </thead>
                <tbody>
                  {villages.map(v => (
                    <tr key={v._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{v._id}</td>
                      <td className="py-3 px-4">{v.total}</td>
                      <td className="py-3 px-4 text-red-600 font-bold">{v.high}</td>
                      <td className="py-3 px-4 text-yellow-600 font-bold">{v.medium}</td>
                      <td className="py-3 px-4 text-green-600 font-bold">{v.low}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${v.total ? Math.round((v.high / v.total) * 100) : 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{v.total ? Math.round((v.high / v.total) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
