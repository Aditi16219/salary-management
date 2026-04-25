import { apiClient } from './client';

export const metaApi = {
  countries: () => apiClient.get<string[]>('/meta/countries'),
  departments: () => apiClient.get<string[]>('/meta/departments'),
  jobTitles: () => apiClient.get<string[]>('/meta/job-titles'),
};
