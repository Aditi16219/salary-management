import type { DepartmentSummary } from '@/types/insights';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function DepartmentSummaryTable({ rows }: { rows: DepartmentSummary[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-blue-100 bg-blue-50">
        <h3 className="font-semibold text-blue-800 text-sm">Department Summary</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Department', 'Employees', 'Avg Salary', 'Min', 'Max'].map((h) => (
              <th key={h} className={`px-4 py-2 font-semibold text-blue-600 text-xs uppercase tracking-wide ${h === 'Department' || h === 'Employees' ? 'text-left' : 'text-right'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r) => (
            <tr key={r.department} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-900">{r.department}</td>
              <td className="px-4 py-2 text-gray-600">{r.employee_count.toLocaleString()}</td>
              <td className="px-4 py-2 text-right font-medium text-gray-900">{fmt(r.avg_salary)}</td>
              <td className="px-4 py-2 text-right text-gray-600">{fmt(r.min_salary)}</td>
              <td className="px-4 py-2 text-right text-gray-600">{fmt(r.max_salary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
