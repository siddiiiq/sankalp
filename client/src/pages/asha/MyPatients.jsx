import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import { getPatients } from '../../services/patientService';

export default function MyPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients().then(r => setPatients(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.village.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/asha')} className="text-gray-400 text-2xl">←</button>
          <h1 className="text-xl font-bold">My Patients ({patients.length})</h1>
        </div>

        <input
          className="input-field"
          placeholder="🔍 Search by name or village..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">👥</p>
            <p className="text-gray-500">{search ? 'No patients match your search' : 'No patients yet. Start a new screening!'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => (
              <div
                key={p._id}
                onClick={() => navigate(`/asha/patients/${p._id}`)}
                className="card flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.age}y • {p.gender} • {p.village}</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
