import type { TopEarner } from '@/types/insights';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function TopEarnersTable({ rows }: { rows: TopEarner[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-violet-100 bg-violet-50">
        <h3 className="font-semibold text-violet-800 text-sm">Top Earners</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['#', 'Name', 'Job Title', 'Department', 'Country', 'Salary'].map((h) => (
              <th key={h} className={`px-4 py-2 font-semibold text-violet-600 text-xs uppercase tracking-wide ${h === 'Salary' ? 'text-right' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r, i) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-400 w-8">{i + 1}</td>
              <td className="px-4 py-2 font-medium text-gray-900">{r.full_name}</td>
              <td className="px-4 py-2 text-gray-600">{r.job_title}</td>
              <td className="px-4 py-2 text-gray-600">{r.department}</td>
              <td className="px-4 py-2 text-gray-600">{r.country}</td>
              <td className="px-4 py-2 text-right font-semibold text-gray-900">{fmt(r.salary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
