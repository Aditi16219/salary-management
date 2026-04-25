import { Search } from 'lucide-react';

interface Props {
  search: string;
  country: string;
  department: string;
  onSearchChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
}

export function EmployeeFilters({
  search, country, department,
  onSearchChange, onCountryChange, onDepartmentChange,
}: Props) {
  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or job title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <input
        type="text"
        placeholder="Filter by country"
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Filter by department"
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
