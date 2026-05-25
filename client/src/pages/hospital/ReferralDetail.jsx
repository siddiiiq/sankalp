import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import ReferralCard from '../../components/referral/ReferralCard';
import RiskBadge from '../../components/dashboard/RiskBadge';
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown';
import { getReferrals } from '../../services/referralService';

export default function ReferralDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);

  useEffect(() => {
    getReferrals().then(r => {
      const found = r.data.find(ref => ref._id === id);
      setReferral(found);
    }).catch(console.error);
  }, [id]);

  if (!referral) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const patient = referral.patientId;
  const screening = referral.screeningId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-5 max-w-3xl">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/hospital')} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-2xl font-bold">Referral Detail</h1>
            {screening?.result?.riskLevel && <RiskBadge level={screening.result.riskLevel} size="lg" />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReferralCard referral={referral} />

            {screening?.result && (
              <div className="card">
                <h3 className="font-bold text-gray-700 mb-4">Risk Analysis</h3>
                <ScoreBreakdown result={screening.result} />
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                  {screening.result.recommendations?.en?.map((r, i) => (
                    <p key={i} className="text-xs text-gray-600">→ {r}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
