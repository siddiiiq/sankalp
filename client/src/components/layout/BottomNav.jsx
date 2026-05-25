import { NavLink } from 'react-router-dom';

const links = [
  { to: '/asha', label: 'Home', icon: '🏠' },
  { to: '/asha/new-screening', label: 'Screen', icon: '➕' },
  { to: '/asha/patients', label: 'Patients', icon: '👥' },
  { to: '/asha/followups', label: 'Follow-ups', icon: '📅' }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-40">
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/asha'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-green-600' : 'text-gray-500'
            }`
          }
        >
          <span className="text-xl">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
