interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'indigo' | 'blue' | 'violet' | 'sky';
}

const colorMap = {
  indigo: 'border-indigo-500 bg-indigo-50',
  blue: 'border-blue-500 bg-blue-50',
  violet: 'border-violet-500 bg-violet-50',
  sky: 'border-sky-500 bg-sky-50',
};

const textMap = {
  indigo: 'text-indigo-700',
  blue: 'text-blue-700',
  violet: 'text-violet-700',
  sky: 'text-sky-700',
};

export function StatCard({ label, value, sub, color = 'indigo' }: Props) {
  return (
    <div className={`rounded-lg border-l-4 p-4 bg-white shadow-sm ${colorMap[color]}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${textMap[color]}`}>{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
