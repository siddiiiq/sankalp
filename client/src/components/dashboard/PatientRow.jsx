import { useNavigate } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import { formatDate } from '../../utils/formatDate';

export default function PatientRow({ alert, basePath = '/doctor' }) {
  const navigate = useNavigate();
  const patient = alert.patientId;
  const screening = alert.screeningId;
  if (!patient) return null;

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
      onClick={() => navigate(`${basePath}/patients/${patient._id}`)}
    >
      <td className="px-4 py-3 font-medium">{patient.name}</td>
      <td className="px-4 py-3 text-gray-500">{patient.village}</td>
      <td className="px-4 py-3">{patient.age}</td>
      <td className="px-4 py-3">
        {screening?.vitals?.systolic}/{screening?.vitals?.diastolic}
      </td>
      <td className="px-4 py-3">{screening?.vitals?.bloodSugar}</td>
      <td className="px-4 py-3"><RiskBadge level={alert.riskLevel} /></td>
      <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(alert.createdAt)}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          alert.status === 'pending' ? 'bg-red-100 text-red-700' :
          alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {alert.status}
        </span>
      </td>
    </tr>
  );
}
