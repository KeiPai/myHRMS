import { Avatar, AvatarFallback, Badge } from '@venizia/ardor-ui-kit';
import type { EmployeeProfile } from '@/types';

interface ProfileHeaderProps {
  employee: EmployeeProfile;
}

export function ProfileHeader({ employee }: ProfileHeaderProps) {
  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const fullName = `${employee.firstName} ${employee.lastName}`;

  const hireDate = new Date(employee.hireDate);
  const now = new Date();
  const months = (now.getFullYear() - hireDate.getFullYear()) * 12 + (now.getMonth() - hireDate.getMonth());

  const statusLabel = `${employee.status === 'active' ? 'Active' : employee.status} ${employee.employmentType.replace('_', '-')}`;

  return (
    <div className="flex items-start gap-6">
      <Avatar className="h-20 w-20">
        <AvatarFallback className="bg-gradient-to-br from-[#00a63e] to-[#00c950] text-2xl font-bold text-white">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
          <p className="text-sm text-muted-foreground">{employee.role}</p>
        </div>

        <Badge variant="secondary" className="border-0 bg-[#dcfce7] font-medium text-[#008236]">
          {statusLabel}
        </Badge>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">Tenure:</span> {months} months
          </div>
          {employee.reportingManagerId && (
            <div>
              <span className="font-medium text-foreground">Line Manager:</span>{' '}
              <span className="text-[hsl(var(--primary))]">View Manager</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
