const steps = [
  'Patient Info',
  'Vitals',
  'Symptoms',
  'Risk Factors',
  'Ayurveda',
  'Pregnancy'
];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                done ? 'bg-green-600 text-white' : active ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'
              }`}>
                {done ? '✓' : num}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${active ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded ${num < current ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
