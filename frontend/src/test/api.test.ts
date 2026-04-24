jest.mock('@/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { employeesApi } from '@/api/employees';
import { insightsApi } from '@/api/insights';

describe('employeesApi', () => {
  it('exports all CRUD methods', () => {
    expect(typeof employeesApi.list).toBe('function');
    expect(typeof employeesApi.get).toBe('function');
    expect(typeof employeesApi.create).toBe('function');
    expect(typeof employeesApi.update).toBe('function');
    expect(typeof employeesApi.remove).toBe('function');
  });
});

describe('insightsApi', () => {
  it('exports all analytics endpoints', () => {
    expect(typeof insightsApi.salaryByCountry).toBe('function');
    expect(typeof insightsApi.salaryByJobTitle).toBe('function');
    expect(typeof insightsApi.headcountByCountry).toBe('function');
    expect(typeof insightsApi.departmentSummary).toBe('function');
    expect(typeof insightsApi.topEarners).toBe('function');
  });
});
