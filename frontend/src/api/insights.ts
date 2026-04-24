import type {
  CountryHeadcount,
  CountrySalaryStats,
  DepartmentSummary,
  JobTitleSalaryStats,
  TopEarner,
} from '@/types/insights';
import { apiClient } from './client';

export const insightsApi = {
  salaryByCountry: () =>
    apiClient.get<CountrySalaryStats[]>('/insights/salary-by-country'),

  salaryByJobTitle: (country: string) =>
    apiClient.get<JobTitleSalaryStats[]>('/insights/salary-by-jobtitle', {
      params: { country },
    }),

  headcountByCountry: () =>
    apiClient.get<CountryHeadcount[]>('/insights/headcount-by-country'),

  departmentSummary: () =>
    apiClient.get<DepartmentSummary[]>('/insights/department-summary'),

  topEarners: (limit?: number) =>
    apiClient.get<TopEarner[]>('/insights/top-earners', { params: { limit } }),
};
