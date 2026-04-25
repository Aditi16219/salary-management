import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeesApi } from '@/api/employees';
import type { Employee } from '@/types/employee';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

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
  const [jobTitle, setJobTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('full_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
        ...(jobTitle && { job_title: jobTitle }),
        sort_by: sortBy,
        sort_order: sortOrder,
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
  }, [page, search, country, department, jobTitle, sortBy, sortOrder]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCountry = (v: string) => { setCountry(v); setPage(1); };
  const handleDepartment = (v: string) => { setDepartment(v); setPage(1); };
  const handleJobTitle = (v: string) => { setJobTitle(v); setPage(1); };

  const executeDelete = async () => {
    if (!deleteId) return;
    await employeesApi.remove(deleteId);
    setEmployees((prev) => prev.filter((e) => e.id !== deleteId));
    setTotal((prev) => prev - 1);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900">Employees</h2>
          {!loading && (
            <p className="text-sm text-indigo-400 mt-1">
              {total.toLocaleString()} total employee{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/employees/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Add Employee
        </button>
      </div>

      <EmployeeFilters
        search={search}
        country={country}
        department={department}
        jobTitle={jobTitle}
        onSearchChange={handleSearch}
        onCountryChange={handleCountry}
        onDepartmentChange={handleDepartment}
        onJobTitleChange={handleJobTitle}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEdit={(id) => navigate(`/employees/${id}/edit`)}
        onDelete={setDeleteId}
      />

      {deleteId && (
        <ConfirmDialog
          title="Delete Employee"
          message="Are you sure you want to delete this employee? This cannot be undone."
          onConfirm={executeDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

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
