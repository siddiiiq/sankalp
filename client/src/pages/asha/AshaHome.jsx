import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import OfflineBanner from '../../components/shared/OfflineBanner';
import SyncStatus from '../../components/shared/SyncStatus';
import { useAuth } from '../../context/AuthContext';
import { getPatients } from '../../services/patientService';
import { getScreenings } from '../../services/screeningService';

export default function AshaHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, todayScreenings: 0, pendingFollowups: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes] = await Promise.all([getPatients(), getScreenings()]);
        const today = new Date().toDateString();
        const todayScreenings = sRes.data.filter(s => new Date(s.createdAt).toDateString() === today).length;
        setStats({ patients: pRes.data.length, todayScreenings, pendingFollowups: 0 });
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      <OfflineBanner />
      <Navbar />

      {/* Main Container - Expands nicely on desktop, stays contained on mobile */}
      <main className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 mt-2">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* ================= LEFT COLUMN (Desktop) / TOP (Mobile) ================= */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* 1. Greeting Card (App-style ID Card) */}
            <div 
              className="relative overflow-hidden rounded-[2rem] p-6 md:p-8 text-white shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700"
              style={{
                boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.4)'
              }}
            >
              {/* Decorative background circles for aesthetic */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 right-20 w-32 h-32 bg-indigo-900 opacity-20 rounded-full -mb-10 blur-xl"></div>
              
              <div className="relative z-10">
                <p className="text-blue-100 font-medium tracking-wide text-sm mb-1">{greeting},</p>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">{user?.name} 👋</h1>
                
                <div className="inline-flex items-center gap-2 bg-black/15 backdrop-blur-md px-3 py-1.5 rounded-full mt-2 border border-white/10">
                  <span className="text-sm font-medium text-blue-50">📍 {user?.village || 'Assigned Area'}</span>
                </div>

                {/* Wrapped SyncStatus in a white container so "Online/Offline" text is always visible */}
                <div className="mt-6 pt-5 border-t border-white/20">
                  <div className="inline-flex items-center bg-white px-4 py-2 rounded-xl shadow-sm">
                    <SyncStatus />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Stats Grid (Vitals) */}
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {[
                { label: 'Patients', value: stats.patients, icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Today', value: stats.todayScreenings, icon: '📋', color: '#8b5cf6', bg: '#f5f3ff' },
                { label: 'Follow-ups', value: stats.pendingFollowups, icon: '⏰', color: '#f59e0b', bg: '#fffbeb' }
              ].map(s => (
                <div 
                  key={s.label} 
                  className="bg-white rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3"
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <div className="text-2xl font-bold text-slate-800 leading-none mb-1">{s.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 3. Clinical Reminder (Visible here on Desktop, moves up on Mobile) */}
            <div className="hidden md:block bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">📌</div>
                <p className="text-base font-bold text-slate-800">Screening Protocol Reminders</p>
              </div>
              <ul className="text-sm text-slate-600 space-y-3 font-medium">
                <li className="flex items-start gap-2"><span className="text-slate-400">•</span> Take BP after patient has rested for at least 5 minutes</li>
                <li className="flex items-start gap-2"><span className="text-slate-400">•</span> Use glucometer specifically for random blood sugar tests</li>
                <li className="flex items-start gap-2"><span className="text-slate-400">•</span> Measure waist circumference accurately at navel level</li>
                <li className="flex items-start gap-2"><span className="text-slate-400">•</span> Record all symptoms the patient reports today</li>
              </ul>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (Desktop) / BOTTOM (Mobile) ================= */}
          <div className="md:col-span-5 flex flex-col gap-5">
            
            {/* Primary Action Button */}
            <button
              onClick={() => navigate('/asha/new-screening')}
              className="group relative w-full rounded-[2rem] p-6 text-white text-left transition-all duration-200 ease-out active:scale-[0.98] bg-gradient-to-br from-blue-500 to-blue-700"
              style={{
                boxShadow: '0 15px 30px -10px rgba(59, 130, 246, 0.4)'
              }}
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center text-3xl shadow-inner border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  ➕
                </div>
                <div className="flex-1">
                  <p className="text-xl font-extrabold mb-1">New Screening</p>
                  <p className="text-blue-100 text-sm font-medium leading-snug">Screen a patient for diabetes, BP & vitals</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="text-xl">→</span>
                </div>
              </div>
            </button>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/asha/patients')} 
                className="bg-white p-5 rounded-[1.5rem] flex flex-col gap-3 items-start border border-slate-100 shadow-sm active:scale-95 transition-all duration-200 hover:shadow-md hover:border-blue-200"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">👥</div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm mb-0.5">My Patients</p>
                  <p className="text-xs font-medium text-slate-500">{stats.patients} registered</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/asha/followups')} 
                className="bg-white p-5 rounded-[1.5rem] flex flex-col gap-3 items-start border border-slate-100 shadow-sm active:scale-95 transition-all duration-200 hover:shadow-md hover:border-blue-200"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl">📅</div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm mb-0.5">Follow-ups</p>
                  <p className="text-xs font-medium text-slate-500">Check due dates</p>
                </div>
              </button>
            </div>

            {/* Clinical Reminder (Mobile Only - stays at bottom of scroll) */}
            <div className="md:hidden mt-2 bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                📌 Protocol Reminder
              </p>
              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li>• Take BP after patient has rested 5 mins</li>
                <li>• Use glucometer for random blood sugar</li>
                <li>• Measure waist accurately at navel level</li>
                <li>• Record all patient-reported symptoms</li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}