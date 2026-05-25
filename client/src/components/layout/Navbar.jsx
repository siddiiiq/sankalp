import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../shared/LanguageToggle';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-2xl"></span>
        <span className="font-bold text-green-700 text-lg">ASDIQA</span>
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
        <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 font-medium">
          Logout
        </button>
      </div>
    </nav>
  );
}
