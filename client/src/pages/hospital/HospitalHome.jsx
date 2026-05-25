import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { getReferrals } from '../../services/referralService';
import { updateReferral } from '../../services/referralService';
import { formatDateTime } from '../../utils/formatDate';

export default function HospitalHome() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferrals().then(r => setReferrals(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const ack = async (id, status) => {
    await updateReferral(id, { status });
    setReferrals(prev => prev.map(r => r._id === id ? { ...r, status } : r));
  };

  const pending = referrals.filter(r => r.status === 'sent');
  const received = referrals.filter(r => r.status !== 'sent');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold">🏥 Incoming Referrals</h1>
            <p className="text-gray-500 text-sm">{pending.length} new referral(s) awaiting acknowledgement</p>
          </div>

          {pending.length > 0 && (
            <div className="card border-l-4 border-red-500">
              <h2 className="font-bold text-red-700 mb-3">🔔 New Referrals ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map(r => (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div>
                      <p className="font-semibold">{r.patientId?.name} — {r.patientId?.age}y {r.patientId?.gender}</p>
                      <p className="text-sm text-gray-500">{r.patientId?.village} • {formatDateTime(r.createdAt)}</p>
                      <p className="text-xs text-gray-400">By: {r.referredBy?.name} • Reason: {r.reason}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => navigate(`/hospital/referrals/${r._id}`)} className="btn-secondary text-xs px-3">View</button>
                      <button onClick={() => ack(r._id, 'received')} className="btn-primary text-xs px-3">Acknowledge</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card overflow-x-auto">
            <h2 className="font-bold text-gray-700 mb-4">All Referrals</h2>
            {loading ? <div className="text-center py-8 text-gray-400">Loading...</div> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Patient</th>
                    <th className="text-left py-3 px-4">Village</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Referred By</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => (
                    <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{r.patientId?.name}</td>
                      <td className="py-3 px-4 text-gray-500">{r.patientId?.village}</td>
                      <td className="py-3 px-4 text-gray-500">{r.patientId?.phone || '—'}</td>
                      <td className="py-3 px-4">{r.referredBy?.name}</td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{formatDateTime(r.createdAt)}</td>
                      <td className="py-3 px-4">
                        <select value={r.status} onChange={e => ack(r._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1">
                          <option value="sent">Sent</option>
                          <option value="received">Received</option>
                          <option value="admitted">Admitted</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => navigate(`/hospital/referrals/${r._id}`)} className="text-blue-600 text-xs hover:underline">View →</button>
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
