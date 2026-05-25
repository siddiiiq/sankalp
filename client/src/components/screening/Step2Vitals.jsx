import { calculateBMI } from '../../utils/calculateBMI';

export default function Step2Vitals({ data, onChange }) {
  const bmi = calculateBMI(data.weight, data.height);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">🩺 Vital Measurements</h2>
      <p className="text-sm text-gray-500">Measure using the ASHA kit. Enter values below.</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
          <div className="relative">
            <input type="number" className="input-field pr-14" placeholder="120" value={data.systolic || ''} onChange={e => onChange({ systolic: e.target.value })} />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">mmHg</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
          <div className="relative">
            <input type="number" className="input-field pr-14" placeholder="80" value={data.diastolic || ''} onChange={e => onChange({ diastolic: e.target.value })} />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">mmHg</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Sugar (Random)</label>
          <div className="relative">
            <input type="number" className="input-field pr-16" placeholder="100" value={data.bloodSugar || ''} onChange={e => onChange({ bloodSugar: e.target.value })} />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">mg/dL</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Waist</label>
          <div className="relative">
            <input type="number" className="input-field pr-8" placeholder="80" value={data.waist || ''} onChange={e => onChange({ waist: e.target.value })} />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">cm</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <div className="relative">
            <input type="number" className="input-field pr-8" placeholder="65" value={data.weight || ''} onChange={e => onChange({ weight: e.target.value })} />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">kg</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <div className="relative">
            <input type="number" className="input-field pr-8" placeholder="160" value={data.height || ''} onChange={e => onChange({ height: e.target.value })} />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">cm</span>
          </div>
        </div>
      </div>

      {bmi && (
        <div className={`rounded-lg p-3 text-center font-bold ${bmi >= 30 ? 'bg-red-50 text-red-700' : bmi >= 25 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
          BMI: {bmi} — {bmi >= 30 ? 'Obese' : bmi >= 25 ? 'Overweight' : bmi >= 23 ? 'At-Risk' : 'Normal'}
        </div>
      )}
    </div>
  );
}
