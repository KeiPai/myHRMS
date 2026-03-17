import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from '@venizia/ardor-ui-kit';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  Bell,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Directory', icon: Users, href: '/directory' },
  { label: 'My Profile', icon: UserCircle, href: '/profile' },
  { label: 'Requests', icon: FileText, href: '/requests' },
  { label: 'Notifications', icon: Bell, href: '/notifications', badge: true },
];

interface AppSidebarProps {
  notificationCount?: number;
}

export function AppSidebar({ notificationCount = 0 }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="w-64 border-r border-border bg-white" collapsible="none">
      <SidebarHeader className="px-4 py-6">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-wider text-foreground">NEXPANDO</h1>
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Growing Together
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <p className="px-4 pb-1 text-xs text-muted-foreground">
            Current Role
          </p>
          <div className="px-4 pb-3">
            <button className="flex w-full items-center gap-2.5 rounded-xl bg-muted px-3 py-2 text-sm text-foreground">
              <UserCircle className="h-4 w-4" />
              <span className="flex-1 text-left">Employee</span>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        'rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && notificationCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-3 px-4 pb-6">
        <div className="flex items-center gap-1">
          <p className="px-2 text-xs text-muted-foreground">Language</p>
        </div>
        <div className="flex gap-1">
          <button className="rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-white">
            EN
          </button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
            VI
          </button>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/logout')}
              className="rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-muted"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
