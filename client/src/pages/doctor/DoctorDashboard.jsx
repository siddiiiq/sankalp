import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatCard from '../../components/dashboard/StatCard';
import RiskBadge from '../../components/dashboard/RiskBadge';
import RiskPieChart from '../../components/charts/RiskPieChart';
import WeeklyLineChart from '../../components/charts/WeeklyLineChart';
import VillageBarChart from '../../components/charts/VillageBarChart';
import { getStats, getWeeklyTrend, getVillageSummary } from '../../services/screeningService';
import { getAlerts } from '../../services/alertService';
import { formatDateTime } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats(), getAlerts({ status: 'pending' }), getWeeklyTrend(), getVillageSummary()
    ]).then(([s, a, w, v]) => {
      setStats(s.data); setAlerts(a.data.slice(0, 5)); setWeekly(w.data); setVillages(v.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 max-w-5xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500 text-sm">PHC Dashboard — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Screened Today" value={stats?.todayCount ?? '—'} icon="📋" color="blue" />
            <StatCard label="High Risk Alerts" value={stats?.pendingAlerts ?? '—'} icon="🚨" color="red" onClick={() => navigate('/doctor/alerts')} />
            <StatCard label="Follow-ups Due" value={stats?.pendingFollowups ?? '—'} icon="⏰" color="yellow" />
            <StatCard label="Total High Risk" value={stats?.highRisk ?? '—'} icon="⚠️" color="red" />
          </div>

          {/* Alert Queue */}
          {alerts.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-red-700 flex items-center gap-2">
                  🚨 High Risk Alerts
                  <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5">{alerts.length}</span>
                </h2>
                <button onClick={() => navigate('/doctor/alerts')} className="text-sm text-blue-600 hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs border-b">
                      <th className="text-left py-2 px-3">Patient</th>
                      <th className="text-left py-2 px-3">Village</th>
                      <th className="text-left py-2 px-3">Age</th>
                      <th className="text-left py-2 px-3">BP</th>
                      <th className="text-left py-2 px-3">Sugar</th>
                      <th className="text-left py-2 px-3">Time</th>
                      <th className="text-left py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map(a => (
                      <tr key={a._id} className="border-b border-gray-50 hover:bg-red-50 cursor-pointer" onClick={() => navigate(`/doctor/patients/${a.patientId?._id}`)}>
                        <td className="py-2 px-3 font-medium">{a.patientId?.name}</td>
                        <td className="py-2 px-3 text-gray-500">{a.patientId?.village}</td>
                        <td className="py-2 px-3">{a.patientId?.age}</td>
                        <td className="py-2 px-3 text-red-600 font-bold">{a.screeningId?.vitals?.systolic}/{a.screeningId?.vitals?.diastolic}</td>
                        <td className="py-2 px-3 text-red-600 font-bold">{a.screeningId?.vitals?.bloodSugar}</td>
                        <td className="py-2 px-3 text-gray-400 text-xs">{formatDateTime(a.createdAt)}</td>
                        <td className="py-2 px-3"><RiskBadge level="HIGH" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RiskPieChart data={stats} />
            <WeeklyLineChart data={weekly} />
            <VillageBarChart data={villages} />
          </div>
        </main>
      </div>
    </div>
  );
}
