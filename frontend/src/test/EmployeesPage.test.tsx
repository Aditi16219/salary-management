import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { employeesApi } from '@/api/employees';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

jest.mock('@/api/employees', () => ({
  employeesApi: { list: jest.fn(), remove: jest.fn() },
}));

jest.mock('@/api/meta', () => ({
  metaApi: {
    countries: jest.fn().mockResolvedValue({ data: [] }),
    departments: jest.fn().mockResolvedValue({ data: [] }),
    jobTitles: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

const mockEmployee = {
  id: '1',
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

const mockResponse = (items = [mockEmployee], total = 1) => ({
  data: { items, total, page: 1, page_size: 20 },
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <EmployeesPage />
    </MemoryRouter>
  );

describe('EmployeesPage', () => {
  beforeEach(() => {
    (employeesApi.list as jest.Mock).mockResolvedValue(mockResponse());
  });

  afterEach(() => jest.clearAllMocks());

  it('shows loading state initially', () => {
    (employeesApi.list as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders employee name after loading', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());
  });

  it('renders job title and country', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
  });

  it('shows total employee count', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByText(/1 total employee/i)).toBeInTheDocument()
    );
  });

  it('shows empty state when no employees', async () => {
    (employeesApi.list as jest.Mock).mockResolvedValue(mockResponse([], 0));
    renderPage();
    await waitFor(() =>
      expect(screen.getByText(/no employees found/i)).toBeInTheDocument()
    );
  });

  it('has a search input', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    );
  });

  it('has an Add Employee button', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByText('Add Employee')).toBeInTheDocument()
    );
  });
});
