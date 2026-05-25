function YesNo({ value, onChange, trueLabel = 'Yes', falseLabel = 'No' }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => onChange(true)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${value === true ? 'bg-red-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>{trueLabel}</button>
      <button type="button" onClick={() => onChange(false)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${value === false ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>{falseLabel}</button>
    </div>
  );
}

export default function Step4RiskFactors({ data, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">⚠️ Risk Factors</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">Family history of Diabetes?</span>
          <YesNo value={data.familyDiabetes} onChange={v => onChange({ familyDiabetes: v })} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">Family history of BP?</span>
          <YesNo value={data.familyBP} onChange={v => onChange({ familyBP: v })} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">Alcohol use?</span>
          <YesNo value={data.alcohol} onChange={v => onChange({ alcohol: v })} />
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="font-medium mb-2">Smoking?</p>
          <div className="flex gap-2">
            {['yes', 'no', 'ex'].map(opt => (
              <button key={opt} type="button" onClick={() => onChange({ smoking: opt })}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${data.smoking === opt ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>
                {opt === 'ex' ? 'Ex-smoker' : opt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="font-medium mb-2">Physical Activity?</p>
          <div className="flex gap-2">
            {['none', 'moderate', 'active'].map(opt => (
              <button key={opt} type="button" onClick={() => onChange({ exercise: opt })}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${data.exercise === opt ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="font-medium mb-2">Stress Level?</p>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map(opt => (
              <button key={opt} type="button" onClick={() => onChange({ stress: opt })}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${data.stress === opt ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
