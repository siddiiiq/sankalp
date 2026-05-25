import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import ReferralCard from '../../components/referral/ReferralCard';
import Modal from '../../components/shared/Modal';
import { getReferrals } from '../../services/referralService';
import { formatDate } from '../../utils/formatDate';

export default function ReferralManager() {
  const [referrals, setReferrals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferrals().then(r => setReferrals(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-5">
          <h1 className="text-2xl font-bold">📋 Referrals Sent</h1>

          <div className="card overflow-x-auto">
            {loading ? <div className="text-center py-8 text-gray-400">Loading...</div> : referrals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No referrals yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Patient</th>
                    <th className="text-left py-3 px-4">Village</th>
                    <th className="text-left py-3 px-4">Referred To</th>
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
                      <td className="py-3 px-4">{r.referredToName}</td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(r.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === 'admitted' ? 'bg-green-100 text-green-700' : r.status === 'received' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelected(r)} className="text-blue-600 text-xs hover:underline">View Card</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Referral Card">
        {selected && <ReferralCard referral={selected} />}
      </Modal>
    </div>
  );
}
