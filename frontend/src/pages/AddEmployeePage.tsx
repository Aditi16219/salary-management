import { useNavigate } from 'react-router-dom';
import { employeesApi } from '@/api/employees';
import type { EmployeeCreate } from '@/types/employee';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

export function AddEmployeePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: EmployeeCreate) => {
    await employeesApi.create(data);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add Employee</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new employee.</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <EmployeeForm submitLabel="Add Employee" onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </div>
  );
}
