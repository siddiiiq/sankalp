function YesNo({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => onChange(true)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${value === true ? 'bg-red-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>Yes</button>
      <button type="button" onClick={() => onChange(false)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${value === false ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>No</button>
    </div>
  );
}

export default function Step5Pregnancy({ data, onChange, gender }) {
  if (gender !== 'female') {
    return (
      <div className="text-center py-12">
        <span className="text-5xl">✅</span>
        <p className="mt-4 text-gray-600 font-medium">Pregnancy section not applicable</p>
        <p className="text-sm text-gray-400">Click Submit to generate risk score</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">🤰 Pregnancy History</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">Currently pregnant?</span>
          <YesNo value={data.isPregnant} onChange={v => onChange({ isPregnant: v })} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">History of gestational diabetes?</span>
          <YesNo value={data.gestationalHistory} onChange={v => onChange({ gestationalHistory: v })} />
        </div>
      </div>
    </div>
  );
}
