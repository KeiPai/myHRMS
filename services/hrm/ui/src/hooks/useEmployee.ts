// services/hrm/ui/src/hooks/useEmployee.ts

import { useState, useCallback } from 'react';
import { EmployeeProfile, ApiError } from '../types';

// TODO: Remove mock data when backend API is ready
const MOCK_PROFILE: EmployeeProfile = {
  id: 'me',
  firstName: 'Nguyen',
  lastName: 'Van A',
  email: 'nguyen.vana@nexpando.com',
  phone: '+84 912 345 678',
  role: 'Senior Software Engineer',
  department: 'Engineering',
  location: 'Ho Chi Minh City, Vietnam',
  status: 'active',
  employmentType: 'full_time',
  hireDate: '2024-03-15',
  personalId: 'VN-2024-0042',
  dateOfBirth: '1995-06-20',
  gender: 'male',
  nationality: 'Vietnamese',
  address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
  emergencyContact: { name: 'Nguyen Thi B', phone: '+84 909 876 543', relationship: 'Spouse' },
  benefits: ['Health Insurance', 'Dental', '15 PTO Days', 'Remote Work'],
  workHistory: [
    { company: 'Nexpando', role: 'Senior Software Engineer', startDate: '2024-03-15', description: 'Full-stack development' },
    { company: 'TechCorp Vietnam', role: 'Software Engineer', startDate: '2021-01-10', endDate: '2024-03-01', description: 'Backend services' },
  ],
  documents: [
    { id: 'd1', name: 'Employment Contract', url: '#', type: 'pdf', uploadedAt: '2024-03-15' },
    { id: 'd2', name: 'NDA Agreement', url: '#', type: 'pdf', uploadedAt: '2024-03-15' },
  ],
  assets: [
    { id: 'a1', name: 'MacBook Pro 16"', serialNumber: 'MBP-2024-042', category: 'Laptop', assignedAt: '2024-03-18' },
  ],
};

// TODO: Replace with real API calls when backend is ready
export const useEmployee = (_employeeId: string | undefined) => {
  const [data] = useState<EmployeeProfile | null>(MOCK_PROFILE);
  const [isLoading] = useState(false);
  const [error] = useState<ApiError | null>(null);

  const fetchEmployee = useCallback(async () => {
    // No-op until backend API is ready
  }, []);

  const updateProfile = useCallback(async (_profileData: Partial<EmployeeProfile>) => {
    // No-op until backend API is ready
    return data;
  }, [data]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchEmployee,
    updateProfile
  };
};
