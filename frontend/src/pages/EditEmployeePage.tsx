import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeesApi } from '@/api/employees';
import type { Employee, EmployeeCreate } from '@/types/employee';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

export function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    employeesApi
      .get(id)
      .then(({ data }) => { setEmployee(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const handleSubmit = async (data: EmployeeCreate) => {
    await employeesApi.update(id!, data);
    navigate('/');
  };

  if (loading) return <div className="text-gray-500 py-8">Loading...</div>;
  if (notFound || !employee) return <div className="text-gray-500 py-8">Employee not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Employee</h2>
        <p className="text-sm text-gray-500 mt-1">{employee.full_name}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <EmployeeForm
          initialData={employee}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
}
