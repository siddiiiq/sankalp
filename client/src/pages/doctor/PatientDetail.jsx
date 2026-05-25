import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import RiskBadge from '../../components/dashboard/RiskBadge';
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown';
import DoctorNotes from '../../components/dashboard/DoctorNotes';
import Modal from '../../components/shared/Modal';
import { getPatient } from '../../services/patientService';
import { getScreenings } from '../../services/screeningService';
import { getAlerts } from '../../services/alertService';
import { createReferral } from '../../services/referralService';
import { formatDateTime } from '../../utils/formatDate';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [alertItem, setAlertItem] = useState(null);
  const [referralModal, setReferralModal] = useState(false);
  const [referralForm, setReferralForm] = useState({ referredToName: 'District Hospital, Mangaluru', referredToEmail: '', reason: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      getPatient(id), getScreenings({ patientId: id }), getAlerts({ patientId: id })
    ]).then(([p, s, a]) => {
      setPatient(p.data); setScreenings(s.data);
      setAlertItem(a.data.find(al => al.patientId?._id === id || al.patientId === id));
    }).catch(console.error);
  }, [id]);

  const sendReferral = async () => {
    if (!referralForm.referredToName || !referralForm.reason) return;
    setSending(true);
    try {
      await createReferral({ patientId: id, screeningId: screenings[0]?._id, ...referralForm });
      setReferralModal(false);
      alertItem && setAlertItem(prev => ({ ...prev, status: 'actioned' }));
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (!patient) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const latest = screenings[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 max-w-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">←</button>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              {latest && <RiskBadge level={latest.result?.riskLevel} size="lg" />}
            </div>
            <button onClick={() => setReferralModal(true)} className="btn-danger">
              📋 Refer to Hospital
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Patient Info */}
            <div className="card space-y-2">
              <h3 className="font-bold text-gray-700">Patient Details</h3>
              {[
                ['Age', `${patient.age} years`], ['Gender', patient.gender],
                ['Village', patient.village], ['Phone', patient.phone || '—']
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-gray-500">{l}</span>
                  <span className="font-medium capitalize">{v}</span>
                </div>
              ))}
            </div>

            {/* Latest Vitals */}
            {latest && (
              <div className="card space-y-2">
                <h3 className="font-bold text-gray-700">Latest Vitals ({formatDateTime(latest.createdAt)})</h3>
                {[
                  ['Blood Pressure', `${latest.vitals?.systolic}/${latest.vitals?.diastolic} mmHg`, latest.vitals?.systolic >= 140],
                  ['Blood Sugar', `${latest.vitals?.bloodSugar} mg/dL`, latest.vitals?.bloodSugar >= 140],
                  ['BMI', latest.vitals?.bmi, latest.vitals?.bmi >= 25],
                  ['Waist', `${latest.vitals?.waist || '—'} cm`, false]
                ].map(([l, v, flag]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className={`font-bold ${flag ? 'text-red-600' : ''}`}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Score Breakdown */}
            {latest?.result && (
              <div className="card">
                <h3 className="font-bold text-gray-700 mb-3">Risk Analysis</h3>
                <ScoreBreakdown result={latest.result} />
              </div>
            )}

            {/* Doctor Notes */}
            {alertItem && (
              <div className="card">
                <h3 className="font-bold text-gray-700 mb-3">Doctor Notes & Status</h3>
                <DoctorNotes alert={alertItem} onUpdate={setAlertItem} />
              </div>
            )}
          </div>

          {/* Screening History */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Screening History</h3>
            <div className="space-y-3">
              {screenings.map(s => (
                <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-500">{formatDateTime(s.createdAt)}</p>
                    <p className="text-xs text-gray-400">BP {s.vitals?.systolic}/{s.vitals?.diastolic} • Sugar {s.vitals?.bloodSugar} • Score {s.result?.score}/20</p>
                  </div>
                  <RiskBadge level={s.result?.riskLevel} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Referral Modal */}
      <Modal open={referralModal} onClose={() => setReferralModal(false)} title="Refer Patient to Hospital">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refer to (Hospital Name)</label>
            <input className="input-field" value={referralForm.referredToName} onChange={e => setReferralForm(f => ({ ...f, referredToName: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Email (optional)</label>
            <input type="email" className="input-field" placeholder="hospital@example.com" value={referralForm.referredToEmail} onChange={e => setReferralForm(f => ({ ...f, referredToEmail: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Referral *</label>
            <textarea className="input-field h-24 resize-none" placeholder="High BP + Diabetic Range — needs specialist review" value={referralForm.reason} onChange={e => setReferralForm(f => ({ ...f, reason: e.target.value }))} />
          </div>
          <button onClick={sendReferral} disabled={sending} className="btn-danger w-full py-3">
            {sending ? 'Sending Referral...' : '📋 Send Referral + Email Hospital'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
