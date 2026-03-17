import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Avatar, AvatarFallback, Button } from '@venizia/ardor-ui-kit';
import { MapPin, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';

interface EmployeeCardProps {
  employee: Employee;
  className?: string;
}

export function EmployeeCard({ employee, className }: EmployeeCardProps) {
  const navigate = useNavigate();
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();

  return (
    <Card className={cn('overflow-hidden rounded-lg border bg-white', className)}>
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-gradient-to-br from-[#00a63e] to-[#00c950] text-lg font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{employee.role}</p>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{employee.department}</span>
          {employee.location && (
            <>
              <span>·</span>
              <span>{employee.location}</span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              <span>{employee.phone}</span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-1 w-full"
          onClick={() => navigate(`/profile/${employee.id}`)}
        >
          Profile
        </Button>
      </CardContent>
    </Card>
  );
}
