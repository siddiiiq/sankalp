import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { getReferrals, updateReferral } from '../../services/referralService';
import { formatDateTime } from '../../utils/formatDate';

export default function HospitalHome() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferrals()
      .then(r => setReferrals(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ack = async (id, status) => {
    await updateReferral(id, { status });
    setReferrals(prev =>
      prev.map(r => (r._id === id ? { ...r, status } : r))
    );
  };

  const pending  = referrals.filter(r => r.status === 'sent');
  const received = referrals.filter(r => r.status !== 'sent');

  /**
   * Returns the best available blood sugar value from a referral's screening.
   * Priority: PHC-confirmed glucose > legacy vitals.bloodSugar
   */
  const getBloodSugar = (r) => {
    const s = r.screeningId;
    if (!s) return null;
    return s.phcTest?.bloodGlucose ?? s.vitals?.bloodSugar ?? null;
  };

  const getGlucoseLabel = (r) => {
    const s = r.screeningId;
    const val = getBloodSugar(r);
    if (!val) return '—';
    if (s?.phcTest?.bloodGlucose) {
      return `${val} mg/dL`;
    }
    return `${val} mg/dL`;
  };

  const getGlucoseResult = (r) => r.screeningId?.phcTest?.glucoseResult ?? null;

  const isHighGlucose = (r) => {
    const result = getGlucoseResult(r);
    if (result === 'diabetic') return true;
    const val = getBloodSugar(r);
    return val !== null && val >= 200;
  };

  const isPreDiabeticGlucose = (r) => {
    const result = getGlucoseResult(r);
    if (result === 'prediabetic') return true;
    const val = getBloodSugar(r);
    return val !== null && val >= 140 && val < 200;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-5">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">🏥 Incoming Referrals</h1>
            <p className="text-gray-500 text-sm">
              {pending.length} new referral(s) awaiting acknowledgement
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total Referrals', value: referrals.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: 'Pending Ack', value: pending.length, color: 'bg-red-50 text-red-700 border-red-200' },
              { label: 'Diabetic Glucose', value: referrals.filter(r => getGlucoseResult(r) === 'diabetic').length, color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { label: 'Needs Classification', value: referrals.filter(r => isHighGlucose(r)).length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            ].map(c => (
              <div key={c.label} className={`border rounded-xl px-4 py-2 text-sm font-semibold ${c.color}`}>
                <span className="text-lg font-bold mr-1">{c.value}</span> {c.label}
              </div>
            ))}
          </div>

          {/* New referrals banner */}
          {pending.length > 0 && (
            <div className="card border-l-4 border-red-500">
              <h2 className="font-bold text-red-700 mb-3">
                🔔 New Referrals ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map(r => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200"
                  >
                    <div>
                      <p className="font-semibold">
                        {r.patientId?.name} — {r.patientId?.age}y {r.patientId?.gender}
                      </p>
                      <p className="text-sm text-gray-500">
                        {r.patientId?.village} • {formatDateTime(r.createdAt)}
                      </p>
                      <p className="text-xs text-gray-400">
                        By: {r.referredBy?.name} • Reason: {r.reason}
                      </p>
                      {/* FIX: blood sugar displayed here */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-500">Blood Sugar:</span>
                        <span className={`text-xs font-bold ${isHighGlucose(r) ? 'text-red-600' : 'text-gray-700'}`}>
                          {getGlucoseLabel(r)}
                        </span>
                        {getGlucoseResult(r) && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            getGlucoseResult(r) === 'diabetic'
                              ? 'bg-red-100 text-red-700'
                              : getGlucoseResult(r) === 'prediabetic'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {getGlucoseResult(r)}
                          </span>
                        )}
                        {isHighGlucose(r) && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            🔬 Needs classification
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/hospital/referrals/${r._id}`)}
                        className="btn-secondary text-xs px-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => ack(r._id, 'received')}
                        className="btn-primary text-xs px-3"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All referrals table */}
          <div className="card overflow-x-auto">
            <h2 className="font-bold text-gray-700 mb-4">All Referrals</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Patient</th>
                    <th className="text-left py-3 px-4">Village</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">BP (mmHg)</th>
                    {/* FIX: Blood Sugar column added */}
                    <th className="text-left py-3 px-4">Blood Sugar</th>
                    <th className="text-left py-3 px-4">Referred By</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => {
                    const glucoseResult = getGlucoseResult(r);
                    const highGlucose = isHighGlucose(r);
                    const preDiabetic = isPreDiabeticGlucose(r);

                    return (
                      <tr
                        key={r._id}
                        className={`border-b border-gray-50 hover:bg-gray-50 ${
                          highGlucose ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-medium">{r.patientId?.name}</td>
                        <td className="py-3 px-4 text-gray-500">{r.patientId?.village}</td>
                        <td className="py-3 px-4 text-gray-500">{r.patientId?.phone || '—'}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {r.screeningId?.vitals?.systolic
                            ? `${r.screeningId.vitals.systolic}/${r.screeningId.vitals.diastolic}`
                            : '—'}
                        </td>
                        {/* FIX: Blood sugar cell with colour-coded badge */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`font-bold text-sm ${highGlucose ? 'text-red-600' : preDiabetic ? 'text-yellow-600' : 'text-gray-700'}`}>
                              {getGlucoseLabel(r)}
                            </span>
                            {glucoseResult && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                                glucoseResult === 'diabetic'
                                  ? 'bg-red-100 text-red-700'
                                  : glucoseResult === 'prediabetic'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {glucoseResult}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{r.referredBy?.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">
                          {formatDateTime(r.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={r.status}
                            onChange={e => ack(r._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                          >
                            <option value="sent">Sent</option>
                            <option value="received">Received</option>
                            <option value="admitted">Admitted</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/hospital/referrals/${r._id}`)}
                              className="text-blue-600 text-xs hover:underline"
                            >
                              View →
                            </button>
                            {highGlucose && (
                              <button
                                onClick={() => navigate(`/hospital/referrals/${r._id}`)}
                                className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full hover:bg-purple-700"
                              >
                                🔬 Classify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
