import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

import RiskBadge from '../../components/dashboard/RiskBadge';
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown';
import DoctorNotes from '../../components/dashboard/DoctorNotes';
import PHCBloodGlucoseTest from '../../components/dashboard/PHCBloodGlucoseTest';

import Modal from '../../components/shared/Modal';

import { getPatient } from '../../services/patientService';
import { getScreenings } from '../../services/screeningService';
import { getAlerts } from '../../services/alertService';
import { createReferral } from '../../services/referralService';

import { formatDateTime } from '../../utils/formatDate';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient]     = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [alertItem, setAlertItem] = useState(null);
  const [loadError, setLoadError] = useState(''); // FIX: surface errors instead of blank

  const [referralModal, setReferralModal] = useState(false);

  const [referralForm, setReferralForm] = useState({
    referredToName: 'District Hospital, Mangaluru',
    referredToEmail: '',
    reason: ''
  });

  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoadError('');
    Promise.all([
      getPatient(id),
      getScreenings({ patientId: id }),
      getAlerts({ patientId: id })
    ])
      .then(([p, s, a]) => {
        setPatient(p.data);

        setScreenings(Array.isArray(s.data) ? s.data : []);

        const alerts = Array.isArray(a.data) ? a.data : [];
        setAlertItem(
          alerts.find(
            al => al.patientId?._id === id || al.patientId === id
          ) ?? null
        );
      })
      .catch(err => {
        console.error(err);
        setLoadError('Failed to load patient data. Please refresh.');
      });
  }, [id]);

  const sendReferral = async () => {
    if (!referralForm.referredToName || !referralForm.reason) return;

    setSending(true);
    try {
      await createReferral({
        patientId: id,
        screeningId: screenings[0]?._id,
        ...referralForm
      });

      setReferralModal(false);

      if (alertItem) {
        setAlertItem(prev => ({ ...prev, status: 'actioned' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleTestComplete = updatedScreening => {
    setScreenings(prev =>
      prev.map(s => s._id === updatedScreening._id ? updatedScreening : s)
    );
  };

  const handleReferToCHC = () => {
    const latest    = screenings[0];
    const glucose   = latest?.phcTest?.bloodGlucose || '';
    const testType  = latest?.phcTest?.testType || 'fasting';

    setReferralForm({
      referredToName: 'Community Health Centre (CHC)',
      referredToEmail: '',
      reason: `Confirmed high blood glucose at PHC: ${glucose} mg/dL (${testType}). Patient requires Type 1 / Type 2 diabetes classification and treatment plan.`
    });

    setReferralModal(true);
  };

  // FIX: show error state instead of blank
  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {loadError}
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  const latest = screenings?.[0];

  const bloodSugarDisplay = () => {
    if (latest?.phcTest?.bloodGlucose) {
      return `${latest.phcTest.bloodGlucose} mg/dL (${latest.phcTest.testType})`;
    }
    return '— Pending PHC test';
  };

  const bloodSugarHigh = Number(latest?.phcTest?.bloodGlucose) >= 140;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-5xl space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-gray-600"
              >
                ←
              </button>

              <h1 className="text-2xl font-bold">{patient.name}</h1>

              {latest && (
                <RiskBadge level={latest?.result?.riskLevel} size="lg" />
              )}
            </div>

            <button
              onClick={() => {
                setReferralForm({
                  referredToName: 'District Hospital, Mangaluru',
                  referredToEmail: '',
                  reason: ''
                });
                setReferralModal(true);
              }}
              className="btn-danger"
            >
              📋 Refer to Hospital
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Patient Info */}
            <div className="card space-y-2">
              <h3 className="font-bold text-gray-700">Patient Details</h3>

              {[
                ['Age',    `${patient.age} years`],
                ['Gender', patient.gender],
                ['Village',patient.village],
                ['Phone',  patient.phone || '—']
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>

            {/* Latest Vitals */}
            {latest && (
              <div className="card space-y-2">
                <h3 className="font-bold text-gray-700">
                  Latest Vitals ({formatDateTime(latest.createdAt)})
                </h3>

                {[
                  ['Blood Pressure', `${latest?.vitals?.systolic || '-'} / ${latest?.vitals?.diastolic || '-'} mmHg`, latest?.vitals?.systolic >= 140],
                  ['Blood Sugar',    bloodSugarDisplay(), bloodSugarHigh],
                  ['BMI',            latest?.vitals?.bmi || '—', latest?.vitals?.bmi >= 25],
                  ['Waist',          `${latest?.vitals?.waist || '—'} cm`, false]
                ].map(([label, value, flag]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-bold ${flag ? 'text-red-600' : ''}`}>{value}</span>
                  </div>
                ))}

                {/* PHC result badge */}
                {latest?.phcTest?.glucoseResult && (
                  <div className={`mt-2 text-xs px-3 py-1.5 rounded-full font-semibold text-center ${
                    latest.phcTest.glucoseResult === 'normal'
                      ? 'bg-green-100 text-green-700'
                      : latest.phcTest.glucoseResult === 'prediabetic'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    PHC Test:{' '}
                    {latest.phcTest.glucoseResult.charAt(0).toUpperCase() +
                      latest.phcTest.glucoseResult.slice(1)}
                    {latest.phcTest.outcome === 'refer_to_chc'
                      ? ' — CHC Referral Required'
                      : ' — Manage at PHC'}
                  </div>
                )}
              </div>
            )}

            {/* Risk Analysis */}
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

          {/* PHC Blood Glucose Test */}
          {latest && (
            <div className="card">
              <PHCBloodGlucoseTest
                screening={latest}
                onTestComplete={handleTestComplete}
                onReferToCHC={handleReferToCHC}
              />
            </div>
          )}

          {/* Screening History */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Screening History</h3>

            <div className="space-y-3">
              {screenings.length === 0 && (
                <p className="text-sm text-gray-400">No screenings recorded yet.</p>
              )}

              {screenings.map(s => (
                <div
                  key={s._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm text-gray-500">{formatDateTime(s.createdAt)}</p>
                    <p className="text-xs text-gray-400">
                      BP {s?.vitals?.systolic}/{s?.vitals?.diastolic}
                      {' • '}
                      {s?.phcTest?.bloodGlucose
                        ? `Blood sugar ${s.phcTest.bloodGlucose} mg/dL (PHC)`
                        : 'Blood sugar — pending PHC test'}
                      {' • '}
                      Score {s?.result?.score}/20
                    </p>

                    {s?.phcTest?.glucoseResult && (
                      <p className={`text-xs font-medium mt-0.5 ${
                        s.phcTest.glucoseResult === 'normal'
                          ? 'text-green-600'
                          : s.phcTest.glucoseResult === 'prediabetic'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        PHC glucose: {s.phcTest.glucoseResult}
                        {s.phcTest.outcome === 'refer_to_chc'
                          ? ' → referred to CHC'
                          : ' → managed at PHC'}
                      </p>
                    )}
                  </div>

                  <RiskBadge level={s?.result?.riskLevel} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Referral Modal */}
      <Modal
        open={referralModal}
        onClose={() => setReferralModal(false)}
        title={
          referralForm.referredToName.includes('CHC')
            ? '🏥 Refer Patient to CHC'
            : '📋 Refer Patient to Hospital'
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refer to (Facility Name)
            </label>
            <input
              className="input-field"
              value={referralForm.referredToName}
              onChange={e => setReferralForm(f => ({ ...f, referredToName: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facility Email (optional)
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="chc@health.gov.in"
              value={referralForm.referredToEmail}
              onChange={e => setReferralForm(f => ({ ...f, referredToEmail: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Referral *
            </label>
            <textarea
              className="input-field h-24 resize-none"
              placeholder="Clinical reason..."
              value={referralForm.reason}
              onChange={e => setReferralForm(f => ({ ...f, reason: e.target.value }))}
            />
          </div>

          <button
            onClick={sendReferral}
            disabled={sending}
            className="btn-danger w-full py-3"
          >
            {sending ? 'Sending Referral...' : '📋 Send Referral + Email Facility'}
          </button>
        </div>
      </Modal>
    </div>
  );
}