import { useState } from 'react';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { EmployeeFilters } from '@/components/directory/EmployeeFilters';
import { ViewToggle } from '@/components/directory/ViewToggle';
import { EmployeeGrid } from '@/components/directory/EmployeeGrid';
import { useEmployees } from '@/hooks/useEmployees';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { ViewMode } from '@/types';

export function EmployeeDirectoryPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading } = useEmployees({
    search: debouncedSearch,
    departmentId: department === 'all' ? '' : department,
  });

  const employees = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <ScreenLayout
      title={`Employee Directory`}
      description={`Manage and connect with your ${total}+ global team members.`}
      actions={<ViewToggle viewMode={viewMode} onViewChange={setViewMode} />}
    >
      <div className="space-y-6">
        <EmployeeFilters
          searchQuery={search}
          onSearchChange={setSearch}
          departmentFilter={department}
          onDepartmentChange={setDepartment}
        />
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[hsl(var(--primary))]" />
          </div>
        ) : (
          <EmployeeGrid employees={employees} />
        )}
      </div>
    </ScreenLayout>
  );
}
