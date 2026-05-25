export default function AlertBadge({ count }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
      {count > 99 ? '99+' : count}
    </span>
  );
}
