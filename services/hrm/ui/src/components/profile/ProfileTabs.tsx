import { Tabs, TabsList, TabsTrigger, TabsContent } from '@venizia/ardor-ui-kit';
import { PersonalInfoSection } from './PersonalInfoSection';
import type { EmployeeProfile } from '@/types';

interface ProfileTabsProps {
  employee: EmployeeProfile;
}

const tabItems = [
  { value: 'profile', label: 'Individual Profile' },
  { value: 'work-history', label: 'Work History' },
  { value: 'payroll', label: 'Payroll & Benefits' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'documents', label: 'Documents & Contracts' },
  { value: 'assets', label: 'Assets' },
];

export function ProfileTabs({ employee }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
        {tabItems.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-[state=active]:border-[hsl(var(--primary))] data-[state=active]:text-[hsl(var(--primary))] data-[state=active]:shadow-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <PersonalInfoSection employee={employee} />
      </TabsContent>
      <TabsContent value="work-history" className="mt-6">
        <div className="py-8 text-center text-muted-foreground">Work history content</div>
      </TabsContent>
      <TabsContent value="payroll" className="mt-6">
        <div className="py-8 text-center text-muted-foreground">Payroll &amp; Benefits content</div>
      </TabsContent>
      <TabsContent value="attendance" className="mt-6">
        <div className="py-8 text-center text-muted-foreground">Attendance content</div>
      </TabsContent>
      <TabsContent value="documents" className="mt-6">
        <div className="py-8 text-center text-muted-foreground">Documents &amp; Contracts content</div>
      </TabsContent>
      <TabsContent value="assets" className="mt-6">
        <div className="py-8 text-center text-muted-foreground">Assets content</div>
      </TabsContent>
    </Tabs>
  );
}
