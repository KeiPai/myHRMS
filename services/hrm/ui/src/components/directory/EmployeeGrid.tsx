import { EmployeeCard } from '@/components/shared/EmployeeCard';
import type { Employee } from '@/types';

interface EmployeeGridProps {
  employees: Employee[];
}

export function EmployeeGrid({ employees }: EmployeeGridProps) {
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No employees found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}
