import { Button } from '@venizia/ardor-ui-kit';
import { LayoutGrid, List, Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from '@/types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const views: { mode: ViewMode; icon: typeof LayoutGrid }[] = [
  { mode: 'grid', icon: LayoutGrid },
  { mode: 'list', icon: List },
  { mode: 'kanban', icon: Columns3 },
];

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
      {views.map(({ mode, icon: Icon }) => (
        <Button
          key={mode}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(mode)}
          className={cn('h-8 w-8 p-0', viewMode === mode && 'bg-muted')}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
