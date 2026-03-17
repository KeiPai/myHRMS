import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, Tabs, TabsList, TabsTrigger, Badge } from '@venizia/ardor-ui-kit';
import { Palmtree, Monitor, FileText, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Request, RequestStatus, RequestType } from '@/types';

type RequestTab = 'all' | RequestType;

interface RequestTableProps {
  requests: Request[];
}

const typeIcons: Record<RequestType, typeof Palmtree> = {
  leave: Palmtree,
  asset: Monitor,
  document: FileText,
  other: FileText,
};

const statusStyles: Record<RequestStatus, string> = {
  approved: 'bg-[#dcfce7] text-[#008236] border-0',
  pending: 'bg-[#ffedd4] text-[#f54900] border-0',
  rejected: 'bg-[#ffe2e2] text-[#c10007] border-0',
};

export function RequestTable({ requests }: RequestTableProps) {
  const [activeTab, setActiveTab] = useState<RequestTab>('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return requests;
    return requests.filter((r) => r.type === activeTab);
  }, [requests, activeTab]);

  return (
    <Card className="rounded-lg border bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold text-foreground">Request History</h3>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RequestTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="leave" className="text-xs">Leave</TabsTrigger>
            <TabsTrigger value="asset" className="text-xs">Assets</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-6 py-3 font-medium">Request Type</th>
              <th className="px-6 py-3 font-medium">Date Submitted</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((request) => {
              const Icon = typeIcons[request.type] || FileText;
              const date = new Date(request.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              });

              return (
                <tr key={request.id} className="border-b last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.title}</p>
                        {request.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{request.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{date}</td>
                  <td className="px-6 py-4">
                    <Badge className={cn('text-xs font-semibold uppercase', statusStyles[request.status])}>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button aria-label="More options" className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
