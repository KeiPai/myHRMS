// services/hrm/ui/src/types/employee.ts

export type EmploymentStatus = 'active' | 'inactive' | 'on_leave';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type Gender = 'male' | 'female' | 'other';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  location?: string;
  status: EmploymentStatus;
  employmentType: EmploymentType;
  hireDate: string;
  avatarUrl?: string;
  reportingManagerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface WorkHistoryEntry {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  serialNumber?: string;
  category: string;
  assignedAt: string;
}

export interface EmployeeProfile extends Employee {
  personalId?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  bankAccount?: string;
  salary?: number;
  benefits?: string[];
  workHistory?: WorkHistoryEntry[];
  documents?: Document[];
  assets?: Asset[];
}
