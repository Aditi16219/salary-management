import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InsightsPage } from '@/pages/InsightsPage';
import { insightsApi } from '@/api/insights';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

jest.mock('@/api/insights', () => ({
  insightsApi: {
    salaryByCountry: jest.fn(),
    departmentSummary: jest.fn(),
    topEarners: jest.fn(),
    headcountByCountry: jest.fn(),
    salaryByJobTitle: jest.fn(),
  },
}));

const mockSalaryByCountry = [
  { country: 'United States', min_salary: 50000, max_salary: 150000, avg_salary: 95000, employee_count: 500 },
  { country: 'United Kingdom', min_salary: 40000, max_salary: 120000, avg_salary: 75000, employee_count: 200 },
];

const mockDeptSummary = [
  { department: 'Engineering', avg_salary: 110000, min_salary: 70000, max_salary: 200000, employee_count: 300 },
];

const mockTopEarners = [
  { id: '1', full_name: 'Alice Smith', job_title: 'Principal Engineer', country: 'USA', department: 'Engineering', salary: 200000 },
];

const mockHeadcount = [{ country: 'United States', employee_count: 500 }];

const setupMocks = () => {
  (insightsApi.salaryByCountry as jest.Mock).mockResolvedValue({ data: mockSalaryByCountry });
  (insightsApi.departmentSummary as jest.Mock).mockResolvedValue({ data: mockDeptSummary });
  (insightsApi.topEarners as jest.Mock).mockResolvedValue({ data: mockTopEarners });
  (insightsApi.headcountByCountry as jest.Mock).mockResolvedValue({ data: mockHeadcount });
  (insightsApi.salaryByJobTitle as jest.Mock).mockResolvedValue({ data: [] });
};

describe('InsightsPage', () => {
  beforeEach(setupMocks);
  afterEach(() => jest.resetAllMocks());

  it('shows loading state initially', () => {
    [insightsApi.salaryByCountry, insightsApi.departmentSummary,
      insightsApi.topEarners, insightsApi.headcountByCountry].forEach((fn) =>
      (fn as jest.Mock).mockReturnValue(new Promise(() => {}))
    );
    render(<MemoryRouter><InsightsPage /></MemoryRouter>);
    expect(screen.getByText('Loading insights…')).toBeInTheDocument();
  });

  it('shows Insights heading after load', async () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Insights')).toBeInTheDocument(), { timeout: 3000 });
  });

  it('renders salary by country section', async () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getAllByText('United States').length).toBeGreaterThan(0), { timeout: 3000 });
  });

  it('renders department summary section', async () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0), { timeout: 3000 });
  });

  it('renders top earners section', async () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument(), { timeout: 3000 });
  });
});
