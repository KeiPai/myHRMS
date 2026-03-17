import { Card, CardContent } from '@venizia/ardor-ui-kit';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  count: number | string;
  label: string;
  sublabel?: string;
  className?: string;
}

export function StatsCard({ icon: Icon, count, label, sublabel, className }: StatsCardProps) {
  return (
    <Card className={cn('rounded-lg border bg-white', className)}>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{count}</p>
          {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
