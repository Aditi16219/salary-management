import type { JobTitleSalaryStats } from '@/types/insights';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

interface Props {
  rows: JobTitleSalaryStats[];
  country: string;
  countries: string[];
  onCountryChange: (c: string) => void;
}

export function SalaryByJobTitleTable({ rows, country, countries, onCountryChange }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-sky-100 bg-sky-50 flex items-center justify-between">
        <h3 className="font-semibold text-sky-800 text-sm">Avg Salary by Job Title</h3>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="text-sm border border-sky-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Job Title', 'Employees', 'Avg Salary'].map((h) => (
              <th
                key={h}
                className={`px-4 py-2 font-semibold text-sky-600 text-xs uppercase tracking-wide ${
                  h === 'Avg Salary' ? 'text-right' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-gray-400 text-sm">
                No data for this country.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.job_title} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{r.job_title}</td>
                <td className="px-4 py-2 text-gray-600">{r.employee_count.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-semibold text-gray-900">{fmt(r.avg_salary)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
