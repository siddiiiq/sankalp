import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PatientRow from '../../components/dashboard/PatientRow';
import { getAlerts } from '../../services/alertService';

export default function AlertQueue() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    getAlerts(params).then(r => setAlerts(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">🚨 Alert Queue</h1>
            <div className="flex gap-2">
              {['pending', 'acknowledged', 'actioned', 'all'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-x-auto">
            {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : alerts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-gray-500">No {filter} alerts</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Patient</th>
                    <th className="text-left py-3 px-4">Village</th>
                    <th className="text-left py-3 px-4">Age</th>
                    <th className="text-left py-3 px-4">BP</th>
                    <th className="text-left py-3 px-4">Sugar</th>
                    <th className="text-left py-3 px-4">Risk</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map(a => <PatientRow key={a._id} alert={a} />)}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
