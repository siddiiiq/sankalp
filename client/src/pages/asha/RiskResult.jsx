import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown';
import { useLanguage } from '../../context/LanguageContext';
import { riskColor, riskEmoji } from '../../utils/riskColor';

export default function RiskResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  if (!state) return navigate('/asha');

  const { result, patient, offline } = state;

  if (offline) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <div className="card text-center py-8">
            <div className="text-5xl mb-4">📴</div>
            <h2 className="text-xl font-bold">Saved Offline</h2>
            <p className="text-gray-500 mt-2">Screening for <strong>{patient?.name}</strong> saved.</p>
            <p className="text-gray-400 text-sm mt-1">Will sync automatically when online.</p>
          </div>
          <button onClick={() => navigate('/asha')} className="btn-primary w-full">← Back to Home</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const recs = result?.recommendations?.[language] || result?.recommendations?.en || [];
  const bgClass = result?.riskLevel === 'HIGH' ? 'from-red-600 to-red-700' : result?.riskLevel === 'MEDIUM' ? 'from-yellow-500 to-yellow-600' : 'from-green-600 to-green-700';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Risk Banner */}
        <div className={`bg-gradient-to-r ${bgClass} text-white rounded-2xl p-6 text-center shadow-lg`}>
          <div className="text-5xl mb-2">{riskEmoji(result?.riskLevel)}</div>
          <h1 className="text-3xl font-black">{result?.riskLevel} RISK</h1>
          <p className="text-white/80 mt-1">Patient: <strong>{patient?.name}</strong></p>
          {result?.riskLevel === 'HIGH' && (
            <div className="mt-3 bg-white/20 rounded-xl p-3">
              <p className="font-bold text-sm">🚨 Alert sent to PHC Doctor ✓</p>
            </div>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="card">
          <h3 className="font-bold mb-3">Risk Score Breakdown</h3>
          <ScoreBreakdown result={result} />
        </div>

        {/* Recommendations */}
        <div className="card">
          <h3 className="font-bold mb-3">📋 What to do next</h3>
          <ul className="space-y-2">
            {recs.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-green-600 font-bold flex-shrink-0">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/asha/new-screening')} className="btn-primary py-3">
            ➕ New Screening
          </button>
          <button onClick={() => navigate('/asha/patients')} className="btn-secondary py-3">
            👥 My Patients
          </button>
        </div>
        <button onClick={() => navigate('/asha')} className="btn-secondary w-full">
          ← Home
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
