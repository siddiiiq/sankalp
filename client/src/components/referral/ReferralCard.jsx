import { formatDate } from '../../utils/formatDate';
import { generateReferralPDF } from '../../utils/generatePDF';

export default function ReferralCard({ referral }) {
  const patient  = referral.patientId;
  const screening = referral.screeningId;
  const doctor   = referral.referredBy;

  if (!patient) return null;

  // FIX: prefer PHC-confirmed blood glucose over the legacy vitals.bloodSugar field
  const bloodSugarValue = screening?.phcTest?.bloodGlucose
    ?? screening?.vitals?.bloodSugar
    ?? null;

  const bloodSugarLabel = screening?.phcTest?.bloodGlucose
    ? `${screening.phcTest.bloodGlucose} mg/dL (${screening.phcTest.testType ?? 'PHC test'})`
    : bloodSugarValue
    ? `${bloodSugarValue} mg/dL`
    : '—';

  const glucoseResultLabel = screening?.phcTest?.glucoseResult
    ? screening.phcTest.glucoseResult.charAt(0).toUpperCase() +
      screening.phcTest.glucoseResult.slice(1)
    : null;

  const isHighGlucose =
    (screening?.phcTest?.glucoseResult === 'diabetic') ||
    (bloodSugarValue >= 200);

  return (
    <div className="border-2 border-blue-300 rounded-xl p-5 bg-blue-50 font-mono text-sm">
      <div className="text-center mb-4">
        <div className="text-blue-700 font-bold text-lg">🌿 NirAmaya — REFERRAL</div>
        <div className="h-px bg-blue-300 mt-2" />
      </div>

      <div className="space-y-1 text-gray-700">
        <p>
          <span className="font-bold w-32 inline-block">Patient:</span>
          {patient.name} | {patient.age} | {patient.gender}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Village:</span>
          {patient.village}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Phone:</span>
          {patient.phone || '—'}
        </p>

        <div className="h-px bg-blue-200 my-2" />

        <p>
          <span className="font-bold w-32 inline-block">BP:</span>
          <span className="text-red-600 font-bold">
            {screening?.vitals?.systolic}/{screening?.vitals?.diastolic} mmHg
          </span>
        </p>

        {/* FIX: blood sugar now shows PHC-confirmed value with classification badge */}
        <p>
          <span className="font-bold w-32 inline-block">Blood Sugar:</span>
          <span className={`font-bold ${isHighGlucose ? 'text-red-600' : 'text-gray-800'}`}>
            {bloodSugarLabel}
          </span>
          {glucoseResultLabel && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
              screening.phcTest.glucoseResult === 'normal'
                ? 'bg-green-100 text-green-700'
                : screening.phcTest.glucoseResult === 'prediabetic'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {glucoseResultLabel}
            </span>
          )}
        </p>

        <p>
          <span className="font-bold w-32 inline-block">BMI:</span>
          {screening?.vitals?.bmi || '—'}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Risk:</span>
          <span className="text-red-600 font-bold">🔴 HIGH</span>
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Flags:</span>
          {screening?.result?.flags?.join(', ') || '—'}
        </p>

        <div className="h-px bg-blue-200 my-2" />

        <p>
          <span className="font-bold w-32 inline-block">Referred by:</span>
          {doctor?.name || '—'}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Referred to:</span>
          {referral.referredToName}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Reason:</span>
          {referral.reason}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Date:</span>
          {formatDate(referral.createdAt)}
        </p>
      </div>

      {/* PHC Ayurvedic recommendations if present */}
      {screening?.phcTest?.ayurvedicRecommendations?.length > 0 && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-bold text-amber-700 mb-1">🌿 PHC Ayurvedic Recommendations</p>
          <ul className="space-y-0.5">
            {screening.phcTest.ayurvedicRecommendations.slice(0, 3).map((r, i) => (
              <li key={i} className="text-xs text-amber-600">→ {r}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => generateReferralPDF(patient, screening, doctor?.name)}
        className="mt-4 btn-primary w-full text-sm"
      >
        Download PDF
      </button>
    </div>
  );
}
