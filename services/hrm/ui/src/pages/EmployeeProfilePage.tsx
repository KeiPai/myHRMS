import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@venizia/ardor-ui-kit';
import { ArrowLeft } from 'lucide-react';
import { ProfileHeader } from '@/components/shared/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useEmployee } from '@/hooks/useEmployee';

export function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[hsl(var(--primary))]" />
      </div>
    );
  }

  if (!employee) {
    return <div className="py-16 text-center text-muted-foreground">Employee not found</div>;
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {fullName}
      </button>

      <div className="flex items-start justify-between">
        <ProfileHeader employee={employee} />
        <Button className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90">
          Update Profile
        </Button>
      </div>

      <ProfileTabs employee={employee} />
    </div>
  );
}
