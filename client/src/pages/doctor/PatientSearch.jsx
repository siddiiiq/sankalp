import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import RiskBadge from '../../components/dashboard/RiskBadge';
import { getScreenings } from '../../services/screeningService';
import { formatDate } from '../../utils/formatDate';

export default function PatientSearch() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    setLoading(true); setSearched(true);
    try {
      const res = await getScreenings();
      let data = res.data;
      if (search) data = data.filter(s => s.patientId?.name?.toLowerCase().includes(search.toLowerCase()) || s.patientId?.village?.toLowerCase().includes(search.toLowerCase()));
      if (riskFilter) data = data.filter(s => s.result?.riskLevel === riskFilter);
      setResults(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-5">
          <h1 className="text-2xl font-bold">🔍 Search Patients</h1>

          <div className="card flex flex-wrap gap-3">
            <input
              className="input-field flex-1 min-w-48"
              placeholder="Search by name or village..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            <select className="input-field w-40" value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
              <option value="">All Risk Levels</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <button onClick={doSearch} className="btn-primary px-6">Search</button>
          </div>

          {loading && <div className="text-center py-8 text-gray-400">Searching...</div>}

          {!loading && searched && (
            <div className="card overflow-x-auto">
              <p className="text-sm text-gray-500 mb-3">{results.length} results found</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Village</th>
                    <th className="text-left py-3 px-4">Age</th>
                    <th className="text-left py-3 px-4">BP</th>
                    <th className="text-left py-3 px-4">Sugar</th>
                    <th className="text-left py-3 px-4">Risk</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(s => (
                    <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/doctor/patients/${s.patientId?._id}`)}>
                      <td className="py-2 px-4 font-medium">{s.patientId?.name}</td>
                      <td className="py-2 px-4 text-gray-500">{s.patientId?.village}</td>
                      <td className="py-2 px-4">{s.patientId?.age}</td>
                      <td className="py-2 px-4">{s.vitals?.systolic}/{s.vitals?.diastolic}</td>
                      <td className="py-2 px-4">{s.vitals?.bloodSugar}</td>
                      <td className="py-2 px-4"><RiskBadge level={s.result?.riskLevel} /></td>
                      <td className="py-2 px-4 text-gray-400 text-xs">{formatDate(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
