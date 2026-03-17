import { useMemo } from 'react';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { RequestTable } from '@/components/requests/RequestTable';
import { CreateRequestDialog } from '@/components/requests/CreateRequestDialog';
import { useRequests } from '@/hooks/useRequests';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import type { RequestType } from '@/types';

export function MyRequestsPage() {
  const { data, isLoading, createRequest } = useRequests();
  const requests = useMemo(() => data?.data ?? [], [data]);

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'pending');
    // TODO: Replace hardcoded leave balance with real API data (e.g., useLeaveBalance hook)
    return { remainingLeave: 12, usedDays: 3, pendingCount: pending.length };
  }, [requests]);

  const handleCreate = async (formData: { type: RequestType; title: string; description: string }) => {
    await createRequest({ type: formData.type, title: formData.title, description: formData.description });
  };

  return (
    <ScreenLayout
      title="My Requests"
      description="Manage your leave, assets, and other administrative requests."
      actions={<CreateRequestDialog onSubmit={handleCreate} isLoading={isLoading} />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <StatsCard icon={Calendar} count={stats.remainingLeave} label="Remaining Annual Leave" sublabel="Full Year" />
          <StatsCard icon={Clock} count={stats.usedDays} label="Used Days" sublabel="Current Year" />
          <StatsCard icon={AlertCircle} count={stats.pendingCount} label="Pending Requests" sublabel="Awaiting Approval" />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[hsl(var(--primary))]" />
          </div>
        ) : (
          <RequestTable requests={requests} />
        )}
      </div>
    </ScreenLayout>
  );
}
