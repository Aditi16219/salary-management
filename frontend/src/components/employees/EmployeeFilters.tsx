import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { metaApi } from '@/api/meta';

interface Props {
  search: string;
  country: string;
  department: string;
  jobTitle: string;
  onSearchChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onJobTitleChange: (v: string) => void;
}

export function EmployeeFilters({
  search, country, department, jobTitle,
  onSearchChange, onCountryChange, onDepartmentChange, onJobTitleChange,
}: Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  useEffect(() => {
    metaApi.countries().then(({ data }) => setCountries(data));
    metaApi.departments().then(({ data }) => setDepartments(data));
    metaApi.jobTitles().then(({ data }) => setJobTitles(data));
  }, []);

  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or job title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
        />
      </div>

      <select
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white"
      >
        <option value="">All Countries</option>
        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white"
      >
        <option value="">All Departments</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <select
        value={jobTitle}
        onChange={(e) => onJobTitleChange(e.target.value)}
        className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white"
      >
        <option value="">All Job Titles</option>
        {jobTitles.map((j) => <option key={j} value={j}>{j}</option>)}
      </select>
    </div>
  );
}
