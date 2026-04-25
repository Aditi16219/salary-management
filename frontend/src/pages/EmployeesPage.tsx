import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeesApi } from '@/api/employees';
import type { Employee } from '@/types/employee';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 20;

export function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    employeesApi
      .list({
        page,
        page_size: PAGE_SIZE,
        ...(search && { search }),
        ...(country && { country }),
        ...(department && { department }),
      })
      .then(({ data }) => {
        if (!cancelled) {
          setEmployees(data.items);
          setTotal(data.total);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, country, department]);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCountry = (v: string) => { setCountry(v); setPage(1); };
  const handleDepartment = (v: string) => { setDepartment(v); setPage(1); };

  const handleDelete = async (id: string) => {
    await employeesApi.remove(id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setTotal((prev) => prev - 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {total.toLocaleString()} total employee{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/employees/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Employee
        </button>
      </div>

      <EmployeeFilters
        search={search}
        country={country}
        department={department}
        onSearchChange={handleSearch}
        onCountryChange={handleCountry}
        onDepartmentChange={handleDepartment}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={(id) => navigate(`/employees/${id}/edit`)}
        onDelete={handleDelete}
      />

      {!loading && total > PAGE_SIZE && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
