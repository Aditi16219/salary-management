import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AddEmployeePage } from '@/pages/AddEmployeePage';
import { EditEmployeePage } from '@/pages/EditEmployeePage';
import { employeesApi } from '@/api/employees';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

jest.mock('@/api/employees', () => ({
  employeesApi: { get: jest.fn(), create: jest.fn(), update: jest.fn() },
}));

const mockEmployee = {
  id: '123',
  full_name: 'Jane Doe',
  job_title: 'Software Engineer',
  country: 'United States',
  salary: 95000,
  department: 'Engineering',
  email: 'jane@example.com',
  hire_date: '2022-01-15',
  employment_type: 'full_time',
  is_active: true,
  created_at: '2022-01-15T00:00:00',
  updated_at: '2022-01-15T00:00:00',
};

describe('AddEmployeePage', () => {
  it('renders the add form with heading', () => {
    render(
      <MemoryRouter>
        <AddEmployeePage />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Add Employee').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Jane Doe')).toBeInTheDocument();
  });
});

describe('EditEmployeePage', () => {
  const renderEdit = () =>
    render(
      <MemoryRouter initialEntries={['/employees/123/edit']}>
        <Routes>
          <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
        </Routes>
      </MemoryRouter>
    );

  it('shows loading state initially', () => {
    (employeesApi.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderEdit();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('populates form with employee data', async () => {
    (employeesApi.get as jest.Mock).mockResolvedValue({ data: mockEmployee });
    renderEdit();
    await waitFor(() =>
      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument()
    );
  });

  it('shows employee name as subtitle', async () => {
    (employeesApi.get as jest.Mock).mockResolvedValue({ data: mockEmployee });
    renderEdit();
    await waitFor(() =>
      expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0)
    );
  });
});
