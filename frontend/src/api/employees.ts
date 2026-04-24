import type {
  Employee,
  EmployeeCreate,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeUpdate,
} from '@/types/employee';
import { apiClient } from './client';

export const employeesApi = {
  list: (params?: EmployeeListParams) =>
    apiClient.get<EmployeeListResponse>('/employees', { params }),

  get: (id: string) =>
    apiClient.get<Employee>(`/employees/${id}`),

  create: (data: EmployeeCreate) =>
    apiClient.post<Employee>('/employees', data),

  update: (id: string, data: EmployeeUpdate) =>
    apiClient.put<Employee>(`/employees/${id}`, data),

  remove: (id: string) =>
    apiClient.delete(`/employees/${id}`),
};
