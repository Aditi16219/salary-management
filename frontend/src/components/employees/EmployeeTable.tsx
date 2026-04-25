import { Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '@/types/employee';

interface Props {
  employees: Employee[];
  loading: boolean;
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

export function EmployeeTable({ employees, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-gray-500">Loading...</div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No employees found.</div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Name', 'Email', 'Job Title', 'Department', 'Country', 'Salary', 'Type', 'Hire Date', ''].map((h) => (
              <th
                key={h}
                className={`px-4 py-3 font-medium text-gray-600 ${h === 'Salary' ? 'text-right' : 'text-left'}`}
              >
                {h}
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
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
                  {formatType(emp.employment_type)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{emp.hire_date}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onEdit(emp.id)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(emp.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    aria-label="Delete"
                  >
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
