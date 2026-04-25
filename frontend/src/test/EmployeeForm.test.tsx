import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

const mockSubmit = jest.fn().mockResolvedValue(undefined);
const mockCancel = jest.fn();

const renderForm = (initialData?: object) =>
  render(
    <EmployeeForm
      onSubmit={mockSubmit}
      onCancel={mockCancel}
      submitLabel="Save"
      initialData={initialData}
    />
  );

describe('EmployeeForm', () => {
  beforeEach(() => {
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('United States')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows validation errors when submitted with empty fields', async () => {
    renderForm();
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() =>
      expect(screen.getAllByText('Required').length).toBeGreaterThan(0)
    );
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when Cancel is clicked', () => {
    renderForm();
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('pre-fills form with initialData', () => {
    renderForm({ full_name: 'John Smith', email: 'john@example.com' });
    expect(screen.getByDisplayValue('John Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });
});
