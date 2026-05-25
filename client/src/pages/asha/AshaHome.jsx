import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import AnimatedPage from '../../components/layout/AnimatedPage';

import OfflineBanner from '../../components/shared/OfflineBanner';
import SyncStatus from '../../components/shared/SyncStatus';

import { useAuth } from '../../context/AuthContext';

import { getPatients } from '../../services/patientService';
import { getScreenings } from '../../services/screeningService';

export default function AshaHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    patients: 0,
    todayScreenings: 0,
    pendingFollowups: 0
  });

  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes] = await Promise.all([
          getPatients(),
          getScreenings()
        ]);

        const today = new Date().toDateString();

        const todayScreenings = sRes.data.filter(
          s => new Date(s.createdAt).toDateString() === today
        ).length;

        setStats({
          patients: pRes.data.length,
          todayScreenings,
          pendingFollowups: 0
        });
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 pb-20">
        <OfflineBanner />

        <Navbar />

        <div className="max-w-lg mx-auto p-4 space-y-5">
          {/* Greeting */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-5">
            <p className="text-green-100 text-sm">{greeting},</p>

            <h1 className="text-2xl font-bold">
              {user?.name} 👋
            </h1>

            <p className="text-green-100 text-sm mt-1">
              Village: {user?.village || 'Assigned Area'}
            </p>

            <div className="mt-3">
              <SyncStatus />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: 'Patients',
                value: stats.patients,
                icon: '👥',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                label: 'Today',
                value: stats.todayScreenings,
                icon: '📋',
                color: 'text-green-600 bg-green-50'
              },
              {
                label: 'Follow-ups',
                value: stats.pendingFollowups,
                icon: '⏰',
                color: 'text-orange-600 bg-orange-50'
              }
            ].map(s => (
              <div
                key={s.label}
                className={`rounded-xl p-3 text-center ${s.color}`}
              >
                <div className="text-2xl">{s.icon}</div>

                <div className="text-2xl font-bold">
                  {s.value}
                </div>

                <div className="text-xs font-medium opacity-80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Primary Action */}
          <button
            onClick={() => navigate('/asha/new-screening')}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 flex items-center gap-4 shadow-md transition-colors"
          >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              ➕
            </div>

            <div className="text-left">
              <p className="text-lg font-bold">
                New Screening
              </p>

              <p className="text-green-100 text-sm">
                Screen a patient for diabetes & BP
              </p>
            </div>

            <span className="ml-auto text-2xl opacity-70">
              →
            </span>
          </button>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/asha/patients')}
              className="card flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">👥</span>

              <div className="text-left">
                <p className="font-semibold text-sm">
                  My Patients
                </p>

                <p className="text-xs text-gray-500">
                  {stats.patients} registered
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/asha/followups')}
              className="card flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📅</span>

              <div className="text-left">
                <p className="font-semibold text-sm">
                  Follow-ups
                </p>

                <p className="text-xs text-gray-500">
                  Check due dates
                </p>
              </div>
            </button>
          </div>

          {/* Clinical reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 mb-2">
              📌 Screening Reminder
            </p>

            <ul className="text-xs text-blue-600 space-y-1">
              <li>
                • Take BP after patient has rested 5 minutes
              </li>

              <li>
                • Use glucometer for random blood sugar
              </li>

              <li>
                • Measure waist at navel level
              </li>

              <li>
                • Record symptoms the patient reports today
              </li>
            </ul>
          </div>
        </div>

        <BottomNav />
      </div>
    </AnimatedPage>
  );
}