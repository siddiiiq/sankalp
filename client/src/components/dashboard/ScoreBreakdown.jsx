import { riskColor } from '../../utils/riskColor';

export default function ScoreBreakdown({ result }) {
  if (!result) return null;
  const pct = Math.round((result.score / result.maxScore) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">Risk Score</span>
        <span className={`font-bold text-lg ${result.riskLevel === 'HIGH' ? 'text-red-600' : result.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
          {result.score} / {result.maxScore}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${result.riskLevel === 'HIGH' ? 'bg-red-500' : result.riskLevel === 'MEDIUM' ? 'bg-yellow-400' : 'bg-green-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {result.flags?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Contributing Factors:</p>
          <div className="flex flex-wrap gap-2">
            {result.flags.map(flag => (
              <span key={flag} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
