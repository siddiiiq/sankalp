import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const doctorLinks = [
  { to: '/doctor/dashboard', label: '🏠 Dashboard' },
  { to: '/doctor/alerts', label: '🚨 Alerts' },
  { to: '/doctor/search', label: '🔍 Search Patients' },
  { to: '/doctor/villages', label: '🗺️ Village Summary' },
  { to: '/doctor/referrals', label: '📋 Referrals' }
];

const hospitalLinks = [
  { to: '/hospital', label: '🏥 Referrals' }
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'doctor' ? doctorLinks : hospitalLinks;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4 hidden md:block">
      <nav className="flex flex-col gap-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
