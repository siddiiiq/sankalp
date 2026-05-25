export default function Step1PatientInfo({ data, onChange, onCreatePatient, createdPatient }) {
  const isCreated = !!createdPatient;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">👤 Patient Information</h2>

      {isCreated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          ✅ Patient registered: <strong>{createdPatient.name}</strong>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input className="input-field" placeholder="Enter patient name" value={data.name || ''} onChange={e => onChange({ name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input type="number" className="input-field" placeholder="Years" value={data.age || ''} onChange={e => onChange({ age: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select className="input-field" value={data.gender || ''} onChange={e => onChange({ gender: e.target.value })}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
          <input className="input-field" placeholder="Village/Hamlet name" value={data.village || ''} onChange={e => onChange({ village: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="tel" className="input-field" placeholder="10-digit mobile number" value={data.phone || ''} onChange={e => onChange({ phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar (Optional)</label>
          <input className="input-field" placeholder="12-digit Aadhaar number" value={data.aadhaar || ''} onChange={e => onChange({ aadhaar: e.target.value })} />
        </div>
      </div>

      {!isCreated && (
        <button onClick={onCreatePatient} className="btn-primary w-full">
          Register Patient & Continue
        </button>
      )}
    </div>
  );
}
