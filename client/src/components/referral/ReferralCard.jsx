import { formatDate } from '../../utils/formatDate';
import { generateReferralPDF } from '../../utils/generatePDF';

export default function ReferralCard({ referral }) {
  const patient = referral.patientId;
  const screening = referral.screeningId;
  const doctor = referral.referredBy;

  if (!patient) return null;

  return (
    <div className="border-2 border-blue-300 rounded-xl p-5 bg-blue-50 font-mono text-sm">
      <div className="text-center mb-4">
        <div className="text-blue-700 font-bold text-lg">🌿 NirAmaya — REFERRAL</div>
        <div className="h-px bg-blue-300 mt-2" />
      </div>

      <div className="space-y-1 text-gray-700">
        <p><span className="font-bold w-32 inline-block">Patient:</span> {patient.name} | {patient.age} | {patient.gender}</p>
        <p><span className="font-bold w-32 inline-block">Village:</span> {patient.village}</p>
        <p><span className="font-bold w-32 inline-block">Phone:</span> {patient.phone || '—'}</p>
        <div className="h-px bg-blue-200 my-2" />
        <p><span className="font-bold w-32 inline-block">BP:</span>
          <span className="text-red-600 font-bold"> {screening?.vitals?.systolic}/{screening?.vitals?.diastolic} mmHg</span>
        </p>
        <p><span className="font-bold w-32 inline-block">Blood Sugar:</span>
          <span className="text-red-600 font-bold"> {screening?.vitals?.bloodSugar} mg/dL</span>
        </p>
        <p><span className="font-bold w-32 inline-block">BMI:</span> {screening?.vitals?.bmi}</p>
        <p><span className="font-bold w-32 inline-block">Risk:</span>
          <span className="text-red-600 font-bold"> 🔴 HIGH</span>
        </p>
        <p><span className="font-bold w-32 inline-block">Flags:</span> {screening?.result?.flags?.join(', ')}</p>
        <div className="h-px bg-blue-200 my-2" />
        <p><span className="font-bold w-32 inline-block">Referred by:</span> {doctor?.name || '—'}</p>
        <p><span className="font-bold w-32 inline-block">Referred to:</span> {referral.referredToName}</p>
        <p><span className="font-bold w-32 inline-block">Reason:</span> {referral.reason}</p>
        <p><span className="font-bold w-32 inline-block">Date:</span> {formatDate(referral.createdAt)}</p>
      </div>

      <button
        onClick={() => generateReferralPDF(patient, screening, doctor?.name)}
        className="mt-4 btn-primary w-full text-sm"
      >
        📄 Download PDF
      </button>
    </div>
  );
}
