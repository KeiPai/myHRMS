// services/hrm/ui/src/types/request.ts

export type RequestType = 'leave' | 'asset' | 'document' | 'other';
export type RequestStatus = 'approved' | 'pending' | 'rejected';

export interface Request {
  id: string;
  employeeId: string;
  type: RequestType;
  title: string;
  description?: string;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
