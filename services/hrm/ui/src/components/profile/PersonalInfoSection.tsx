import { SectionAccordion } from '@/components/shared/SectionAccordion';
import type { EmployeeProfile } from '@/types';

interface PersonalInfoSectionProps {
  employee: EmployeeProfile;
}

export function PersonalInfoSection({ employee }: PersonalInfoSectionProps) {
  const fullName = `${employee.firstName} ${employee.lastName}`;

  const personalFields = [
    { label: 'Employee ID', value: employee.personalId },
    { label: 'Place of Origin', value: employee.nationality },
    { label: 'Last Name', value: employee.lastName },
    { label: 'Marital Status', value: undefined },
    { label: 'First Name', value: employee.firstName },
    { label: 'Personal Tax Code', value: undefined },
    { label: 'Full Name', value: fullName },
    { label: 'Family City', value: undefined },
    { label: 'Nickname', value: undefined },
    { label: 'Personal City', value: undefined },
    { label: 'Gender', value: employee.gender },
    { label: 'Ethnicity', value: undefined },
    { label: 'Date of Birth', value: employee.dateOfBirth },
    { label: 'Religion', value: undefined },
  ];

  const contactFields = [
    { label: 'Email', value: employee.email },
    { label: 'Phone', value: employee.phone },
    { label: 'Address', value: employee.address },
  ];

  const emergencyFields = employee.emergencyContact
    ? [
        { label: 'Contact Name', value: employee.emergencyContact.name },
        { label: 'Phone', value: employee.emergencyContact.phone },
        { label: 'Relationship', value: employee.emergencyContact.relationship },
      ]
    : [
        { label: 'Contact Name', value: undefined },
        { label: 'Phone', value: undefined },
        { label: 'Relationship', value: undefined },
      ];

  return (
    <div className="space-y-4">
      <SectionAccordion
        title="Personal Identification"
        subtitle="General Information"
        fields={personalFields}
      />
      <SectionAccordion title="Contact Information" fields={contactFields} defaultOpen={false} />
      <SectionAccordion title="Emergency Contacts" fields={emergencyFields} defaultOpen={false} />
    </div>
  );
}
