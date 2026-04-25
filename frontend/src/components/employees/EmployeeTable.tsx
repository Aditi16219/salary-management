import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '@/types/employee';

interface Props {
  employees: Employee[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (col: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatSalary = (salary: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary);

const formatType = (type: string) =>
  type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const COLUMNS = [
  { label: 'Name', key: 'full_name', sortable: false },
  { label: 'Email', key: 'email', sortable: false },
  { label: 'Job Title', key: 'job_title', sortable: false },
  { label: 'Department', key: 'department', sortable: false },
  { label: 'Country', key: 'country', sortable: false },
  { label: 'Salary', key: 'salary', sortable: true, right: true },
  { label: 'Type', key: 'employment_type', sortable: false },
  { label: 'Hire Date', key: 'hire_date', sortable: true },
  { label: '', key: '', sortable: false },
];

function SortIcon({ col, sortBy, sortOrder }: { col: string; sortBy: string; sortOrder: string }) {
  if (sortBy !== col) return <ChevronsUpDown size={13} className="inline ml-1 opacity-40" />;
  return sortOrder === 'asc'
    ? <ChevronUp size={13} className="inline ml-1 text-indigo-300" />
    : <ChevronDown size={13} className="inline ml-1 text-indigo-300" />;
}

export function EmployeeTable({ employees, loading, sortBy, sortOrder, onSort, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="flex justify-center py-12 text-gray-500">Loading...</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center py-12 text-gray-500">No employees found.</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-indigo-50 border-b border-indigo-100">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                onClick={() => col.sortable && onSort(col.key)}
                className={`px-4 py-3 font-semibold text-indigo-700 text-xs uppercase tracking-wide whitespace-nowrap ${
                  col.right ? 'text-right' : 'text-left'
                } ${col.sortable ? 'cursor-pointer hover:text-indigo-900 select-none' : ''}`}
              >
                {col.label}
                {col.sortable && <SortIcon col={col.key} sortBy={sortBy} sortOrder={sortOrder} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{emp.full_name}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{emp.email}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{emp.job_title}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{emp.department}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{emp.country}</td>
              <td className="px-4 py-3 text-right text-gray-900">{formatSalary(emp.salary)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                  emp.employment_type === 'full_time'
                    ? 'bg-green-100 text-green-700'
                    : emp.employment_type === 'part_time'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {formatType(emp.employment_type)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{emp.hire_date}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => onEdit(emp.id)} className="p-1 text-gray-400 hover:text-indigo-600" aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onDelete(emp.id)} className="p-1 text-gray-400 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
