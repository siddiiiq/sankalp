import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';

import api from '../../services/api';
import { formatDate, daysUntil } from '../../utils/formatDate';

export default function FollowUps() {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/followups').then(r => setFollowups(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const complete = async (id) => {
    await api.patch(`/followups/${id}/complete`);
    setFollowups(prev => prev.map(f => f._id === id ? { ...f, status: 'done' } : f));
  };

  const pending = followups.filter(f => f.status !== 'done');
  const done = followups.filter(f => f.status === 'done');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/asha')} className="text-gray-400 text-2xl">←</button>
          <h1 className="text-xl font-bold">Follow-ups</h1>
        </div>

        {loading ? <div className="text-center py-8 text-gray-400">Loading...</div> : (
          <>
            <p className="text-sm text-gray-500">{pending.length} pending • {done.length} completed</p>
            {pending.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-gray-500">All follow-ups done!</p>
              </div>
            ) : (
              pending.map(f => {
                const days = daysUntil(f.dueDate);
                const overdue = days < 0;
                return (
                  <div key={f._id} className={`card border-l-4 ${overdue ? 'border-red-500 bg-red-50' : days <= 3 ? 'border-yellow-500 bg-yellow-50' : 'border-green-500'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{f.patientId?.name}</p>
                        <p className="text-sm text-gray-500">{f.patientId?.village}</p>
                        <p className={`text-xs font-medium mt-1 ${overdue ? 'text-red-600' : 'text-yellow-600'}`}>
                          {overdue ? `⚠️ Overdue by ${Math.abs(days)} days` : `Due: ${formatDate(f.dueDate)} (${days}d)`}
                        </p>
                      </div>
                      <button onClick={() => complete(f._id)} className="btn-primary text-xs px-3 py-1.5">
                        Done ✓
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
