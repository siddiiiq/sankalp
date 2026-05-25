import { riskColor, riskEmoji } from '../../utils/riskColor';

export default function RiskBadge({ level, size = 'sm' }) {
  const classes = size === 'lg' ? 'text-base px-4 py-2' : 'text-xs px-2 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${riskColor(level)} ${classes}`}>
      {riskEmoji(level)} {level}
    </span>
  );
}
