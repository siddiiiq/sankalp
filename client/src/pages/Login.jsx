import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from '../components/shared/LanguageToggle';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('asha');
  const [form, setForm] = useState({ ashaId: '', pin: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ ...form, role });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3"></div>
          <h1 className="text-3xl font-bold text-green-700">ASDIQA</h1>
          <p className="text-gray-500 text-sm mt-1">Rural Health Screening System</p>
          <div className="mt-3 flex justify-center">
            <LanguageToggle />
          </div>
        </div>

        {/* Role tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          {[
            { key: 'asha', label: ' ASHA Worker' },
            { key: 'doctor', label: ' PHC Doctor' },
            { key: 'hospital', label: ' Hospital' }
          ].map(r => (
            <button
              key={r.key}
              onClick={() => { setRole(r.key); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${role === r.key ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'asha' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ASHA Worker ID</label>
                <input
                  className="input-field"
                  placeholder="e.g. ASHA001"
                  value={form.ashaId}
                  onChange={e => setForm(f => ({ ...f, ashaId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="4-digit PIN"
                  maxLength={4}
                  value={form.pin}
                  onChange={e => setForm(f => ({ ...f, pin: e.target.value }))}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="doctor@phc.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
          <p className="font-semibold mb-1">Demo credentials:</p>
          <p>ASHA: <strong>ASHA001</strong> / PIN: <strong>1234</strong></p>
          <p>Doctor: <strong>doctor@phc.com</strong> / <strong>doctor123</strong></p>
          <p>Hospital: <strong>hospital@chc.com</strong> / <strong>hospital123</strong></p>
        </div>
      </div>
    </div>
  );
}
