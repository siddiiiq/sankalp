import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import RiskBadge from '../../components/dashboard/RiskBadge';
import { getPatient } from '../../services/patientService';
import { getScreenings } from '../../services/screeningService';
import { formatDateTime } from '../../utils/formatDate';

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [screenings, setScreenings] = useState([]);

  useEffect(() => {
    Promise.all([getPatient(id), getScreenings({ patientId: id })])
      .then(([p, s]) => { setPatient(p.data); setScreenings(s.data); })
      .catch(console.error);
  }, [id]);

  if (!patient) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 text-2xl">←</button>
          <h1 className="text-xl font-bold">Patient History</h1>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-2xl">
              {patient.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-gray-500">{patient.age}y • {patient.gender} • {patient.village}</p>
              {patient.phone && <p className="text-gray-400 text-sm">📞 {patient.phone}</p>}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-gray-700">Screening History ({screenings.length})</h3>

        {screenings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No screenings yet</div>
        ) : (
          screenings.map(s => (
            <div key={s._id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{formatDateTime(s.createdAt)}</span>
                <RiskBadge level={s.result?.riskLevel} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">BP</p>
                  <p className="font-bold text-sm">{s.vitals?.systolic}/{s.vitals?.diastolic}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Sugar</p>
                  <p className="font-bold text-sm">{s.vitals?.bloodSugar}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">BMI</p>
                  <p className="font-bold text-sm">{s.vitals?.bmi}</p>
                </div>
              </div>
              {s.result?.score !== undefined && (
                <p className="text-xs text-gray-500">Score: {s.result.score}/20 • {s.result?.flags?.join(', ')}</p>
              )}
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}
