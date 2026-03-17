import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@venizia/ardor-ui-kit';
import { AppSidebar } from '@/components/shared/AppSidebar';

interface AppLayoutProps {
  notificationCount?: number;
}

export function AppLayout({ notificationCount = 0 }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <AppSidebar notificationCount={notificationCount} />
        <SidebarInset className="flex-1 overflow-auto bg-muted p-6">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
