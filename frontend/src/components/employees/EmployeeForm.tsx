import { useState } from 'react';
import type { EmployeeCreate, EmploymentType } from '@/types/employee';

interface Props {
  initialData?: Partial<EmployeeCreate & { salary: number }>;
  onSubmit: (data: EmployeeCreate) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
];

type FormState = {
  full_name: string;
  email: string;
  job_title: string;
  country: string;
  salary: string;
  department: string;
  hire_date: string;
  employment_type: string;
};

export function EmployeeForm({ initialData, onSubmit, onCancel, submitLabel }: Props) {
  const [form, setForm] = useState<FormState>({
    full_name: initialData?.full_name ?? '',
    email: initialData?.email ?? '',
    job_title: initialData?.job_title ?? '',
    country: initialData?.country ?? '',
    salary: initialData?.salary != null ? String(initialData.salary) : '',
    department: initialData?.department ?? '',
    hire_date: initialData?.hire_date ?? '',
    employment_type: initialData?.employment_type ?? 'full_time',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      setErrors((p) => ({ ...p, [key]: undefined }));
    };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.full_name.trim()) errs.full_name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.job_title.trim()) errs.job_title = 'Required';
    if (!form.country.trim()) errs.country = 'Required';
    if (!form.salary || isNaN(Number(form.salary))) errs.salary = 'Required';
    if (!form.department.trim()) errs.department = 'Required';
    if (!form.hire_date) errs.hire_date = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        full_name: form.full_name,
        email: form.email,
        job_title: form.job_title,
        country: form.country,
        salary: Number(form.salary),
        department: form.department,
        hire_date: form.hire_date,
        employment_type: form.employment_type as EmploymentType,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.full_name}>
          <input type="text" placeholder="Jane Doe" value={form.full_name} onChange={set('full_name')} className={inputCls(errors.full_name)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} className={inputCls(errors.email)} />
        </Field>
        <Field label="Job Title" error={errors.job_title}>
          <input type="text" placeholder="Software Engineer" value={form.job_title} onChange={set('job_title')} className={inputCls(errors.job_title)} />
        </Field>
        <Field label="Department" error={errors.department}>
          <input type="text" placeholder="Engineering" value={form.department} onChange={set('department')} className={inputCls(errors.department)} />
        </Field>
        <Field label="Country" error={errors.country}>
          <input type="text" placeholder="United States" value={form.country} onChange={set('country')} className={inputCls(errors.country)} />
        </Field>
        <Field label="Salary (USD)" error={errors.salary}>
          <input type="number" placeholder="80000" min="0" value={form.salary} onChange={set('salary')} className={inputCls(errors.salary)} />
        </Field>
        <Field label="Hire Date" error={errors.hire_date}>
          <input type="date" value={form.hire_date} onChange={set('hire_date')} className={inputCls(errors.hire_date)} />
        </Field>
        <Field label="Employment Type">
          <select value={form.employment_type} onChange={set('employment_type')} className={inputCls()}>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (error?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
