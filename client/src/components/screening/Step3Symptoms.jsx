const symptoms = [
  { key: 'urination', label: 'Frequent Urination', icon: '🚽' },
  { key: 'thirst', label: 'Excessive Thirst', icon: '💧' },
  { key: 'vision', label: 'Blurred Vision', icon: '👁️' },
  { key: 'headache', label: 'Headache / Dizziness', icon: '🤕' },
  { key: 'fatigue', label: 'Fatigue / Weakness', icon: '😴' },
  { key: 'numbness', label: 'Numbness in Hands/Feet', icon: '🖐️' }
];

export default function Step3Symptoms({ data, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">🔍 Symptom Check</h2>
      <p className="text-sm text-gray-500">Tap Yes or No for each symptom the patient reports.</p>

      <div className="space-y-3">
        {symptoms.map(s => (
          <div key={s.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="font-medium text-gray-700">{s.label}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ [s.key]: true })}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  data[s.key] === true ? 'bg-red-600 text-white' : 'bg-white text-gray-500 border border-gray-300'
                }`}
              >Yes</button>
              <button
                type="button"
                onClick={() => onChange({ [s.key]: false })}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  data[s.key] === false ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border border-gray-300'
                }`}
              >No</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
