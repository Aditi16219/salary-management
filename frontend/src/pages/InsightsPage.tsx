import { useEffect, useState } from 'react';
import { insightsApi } from '@/api/insights';
import type { CountrySalaryStats, DepartmentSummary, TopEarner, CountryHeadcount } from '@/types/insights';
import { StatCard } from '@/components/ui/StatCard';
import { SalaryByCountryTable } from '@/components/insights/SalaryByCountryTable';
import { DepartmentSummaryTable } from '@/components/insights/DepartmentSummaryTable';
import { TopEarnersTable } from '@/components/insights/TopEarnersTable';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function InsightsPage() {
  const [countryStats, setCountryStats] = useState<CountrySalaryStats[]>([]);
  const [deptStats, setDeptStats] = useState<DepartmentSummary[]>([]);
  const [topEarners, setTopEarners] = useState<TopEarner[]>([]);
  const [headcount, setHeadcount] = useState<CountryHeadcount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      insightsApi.salaryByCountry(),
      insightsApi.departmentSummary(),
      insightsApi.topEarners(10),
      insightsApi.headcountByCountry(),
    ]).then(([c, d, t, h]) => {
      setCountryStats(c.data);
      setDeptStats(d.data);
      setTopEarners(t.data);
      setHeadcount(h.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-gray-500 py-8">Loading insights…</div>;
  }

  const totalEmployees = headcount.reduce((s, r) => s + r.employee_count, 0);
  const allAvg = countryStats.length
    ? countryStats.reduce((s, r) => s + r.avg_salary * r.employee_count, 0) / totalEmployees
    : 0;
  const globalMax = countryStats.length ? Math.max(...countryStats.map((r) => r.max_salary)) : 0;
  const topCountry = headcount[0]?.country ?? '—';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Insights</h2>
        <p className="text-sm text-gray-500 mt-1">Salary analytics across your organization.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={totalEmployees.toLocaleString()} />
        <StatCard label="Global Avg Salary" value={fmt(allAvg)} />
        <StatCard label="Highest Salary" value={fmt(globalMax)} />
        <StatCard label="Top Country" value={topCountry} sub={`${headcount[0]?.employee_count.toLocaleString() ?? 0} employees`} />
      </div>

      {/* Country breakdown */}
      <SalaryByCountryTable rows={countryStats} />

      {/* Bottom two tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentSummaryTable rows={deptStats} />
        <TopEarnersTable rows={topEarners} />
      </div>
    </div>
  );
}
