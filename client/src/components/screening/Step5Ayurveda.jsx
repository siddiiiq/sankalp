const ayurvedicSymptoms = [
  {
    key: 'bodyHeat',
    label: 'Excessive body heat / burning sensation',
    icon: '🔥',
    sanskrit: 'Daha'
  },
  {
    key: 'digestiveIssues',
    label: 'Digestive irregularities / bloating',
    icon: '🫁',
    sanskrit: 'Agnimandya'
  },
  {
    key: 'fatigue',
    label: 'Fatigue and lethargy',
    icon: '😴',
    sanskrit: 'Klama'
  },
  {
    key: 'sleepDisturbances',
    label: 'Sleep disturbances / insomnia',
    icon: '🌙',
    sanskrit: 'Nidranasha'
  },
  {
    key: 'frequentThirst',
    label: 'Frequent or excessive thirst',
    icon: '💧',
    sanskrit: 'Trishna'
  },
  {
    key: 'skinDryness',
    label: 'Skin dryness / itching',
    icon: '🖐️',
    sanskrit: 'Twak Raukshya'
  },
  {
    key: 'urinaryAbnormalities',
    label: 'Urinary abnormalities / cloudiness',
    icon: '🚽',
    sanskrit: 'Prameha'
  }
];

export default function Step5Ayurveda({ data, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">
        🌿 Ayurvedic Symptom Assessment
      </h2>

      <p className="text-sm text-gray-500">
        Traditional indicators of metabolic imbalance (Prameha Purvarupa).
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-700 font-medium">
          📌 These Ayurvedic indicators help identify early-stage metabolic risk.
        </p>
      </div>

      <div className="space-y-3">
        {ayurvedicSymptoms.map(s => (
          <div
            key={s.key}
            className="flex items-center justify-between p-3 bg-amber-50/40 rounded-xl border border-amber-100"
          >
            <div className="flex items-center gap-3 flex-1 mr-3">
              <span className="text-2xl">{s.icon}</span>

              <div>
                <p className="font-medium text-gray-700 text-sm">
                  {s.label}
                </p>

                <p className="text-xs text-amber-600 italic">
                  {s.sanskrit}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => onChange({ [s.key]: true })}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  data[s.key] === true
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-500 border border-gray-300'
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => onChange({ [s.key]: false })}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  data[s.key] === false
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-500 border border-gray-300'
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}