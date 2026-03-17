import { Input, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@venizia/ardor-ui-kit';
import { Search } from 'lucide-react';

interface EmployeeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departmentFilter: string;
  onDepartmentChange: (department: string) => void;
  departments?: { id: string; name: string }[];
}

export function EmployeeFilters({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments = [],
}: EmployeeFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, position, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={departmentFilter} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
