import type { CountrySalaryStats } from '@/types/insights';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function SalaryByCountryTable({ rows }: { rows: CountrySalaryStats[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-indigo-100 bg-indigo-50">
        <h3 className="font-semibold text-indigo-800 text-sm">Salary by Country</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Country', 'Employees', 'Min', 'Avg', 'Max'].map((h) => (
              <th key={h} className={`px-4 py-2 font-semibold text-indigo-600 text-xs uppercase tracking-wide ${h === 'Country' || h === 'Employees' ? 'text-left' : 'text-right'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r) => (
            <tr key={r.country} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-900">{r.country}</td>
              <td className="px-4 py-2 text-gray-600">{r.employee_count.toLocaleString()}</td>
              <td className="px-4 py-2 text-right text-gray-600">{fmt(r.min_salary)}</td>
              <td className="px-4 py-2 text-right font-medium text-gray-900">{fmt(r.avg_salary)}</td>
              <td className="px-4 py-2 text-right text-gray-600">{fmt(r.max_salary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
