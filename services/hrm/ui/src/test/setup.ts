import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  constructor(name: string) {
    this.name = name;
  }
  postMessage(_message: any) {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
}

global.BroadcastChannel = MockBroadcastChannel as any;

// Mock window.__env
(window as any).__env = {
  VITE_API_URL: 'http://localhost:3012/api',
};

// Mock Ardor UI Kit to avoid resolution issues in tests
vi.mock('@venizia/ardor-ui-kit', () => {
  return {
    Button: ({ children, ...props }: any) => React.createElement('button', props, children),
    Card: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardHeader: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardFooter: ({ children, ...props }: any) => React.createElement('div', props, children),
    Input: (props: any) => React.createElement('input', props),
    TextField: (props: any) => React.createElement('input', { type: props.type, placeholder: props.placeholder, value: props.value, onChange: props.onChange, required: props.required }),
    PasswordInput: (props: any) => React.createElement('input', { type: 'password', ...props }),
    CheckboxInput: ({ label, checked, onCheckedChange, ...props }: any) => React.createElement('label', props, React.createElement('input', { type: 'checkbox', checked, onChange: (e: any) => onCheckedChange?.(e.target.checked) }), label),
    Alert: ({ children, ...props }: any) => React.createElement('div', { role: 'alert', ...props }, children),
    AlertDescription: ({ children, ...props }: any) => React.createElement('div', props, children),
    Label: ({ children, ...props }: any) => React.createElement('label', { htmlFor: props.htmlFor }, children),
    Badge: ({ children, ...props }: any) => React.createElement('span', props, children),
    Avatar: ({ children, ...props }: any) => React.createElement('div', props, children),
    AvatarFallback: ({ children, ...props }: any) => React.createElement('div', props, children),
    AvatarImage: (props: any) => React.createElement('img', props),
    Tabs: ({ children, value, defaultValue, onValueChange, ...props }: any) => {
      const [activeValue, setActiveValue] = React.useState(value || defaultValue);
      React.useEffect(() => {
        if (value !== undefined) setActiveValue(value);
      }, [value]);

      const handleValueChange = (v: string) => {
        if (onValueChange) onValueChange(v);
        if (value === undefined) setActiveValue(v);
      };

      return React.createElement('div', { ...props, 'data-active-tab': activeValue }, 
        React.Children.map(children, child => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as any, { 
            activeValue, 
            onValueChange: handleValueChange 
          });
        })
      );
    },
    TabsList: ({ children, activeValue, onValueChange, ...props }: any) => 
      React.createElement('div', { role: 'tablist', ...props }, 
        React.Children.map(children, child => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as any, { activeValue, onValueChange });
        })
      ),
    TabsTrigger: ({ children, value, activeValue, onValueChange, ...props }: any) => 
      React.createElement('button', { 
        role: 'tab', 
        'aria-selected': activeValue === value ? 'true' : 'false',
        onClick: () => onValueChange?.(value),
        ...props 
      }, children),
    TabsContent: ({ children, value, activeValue, ...props }: any) => 
      activeValue === value ? React.createElement('div', { role: 'tabpanel', ...props }, children) : null,
    Select: ({ children, ...props }: any) => React.createElement('div', props, children),
    SelectTrigger: ({ children, ...props }: any) => React.createElement('button', props, children),
    SelectValue: ({ children, ...props }: any) => React.createElement('span', props, children),
    SelectContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    SelectItem: ({ children, ...props }: any) => React.createElement('div', props, children),
    Dialog: ({ children, ...props }: any) => React.createElement('div', props, children),
    DialogTrigger: ({ children, ...props }: any) => React.createElement('div', props, children),
    DialogContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    DialogHeader: ({ children, ...props }: any) => React.createElement('div', props, children),
    DialogTitle: ({ children, ...props }: any) => React.createElement('h2', props, children),
    DialogFooter: ({ children, ...props }: any) => React.createElement('div', props, children),
    Sidebar: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarHeader: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarFooter: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarMenu: ({ children, ...props }: any) => React.createElement('ul', props, children),
    SidebarMenuItem: ({ children, ...props }: any) => React.createElement('li', props, children),
    SidebarMenuButton: ({ children, ...props }: any) => React.createElement('button', props, children),
    SidebarGroup: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarGroupContent: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarProvider: ({ children, ...props }: any) => React.createElement('div', props, children),
    SidebarInset: ({ children, ...props }: any) => React.createElement('div', props, children),
  };
});

// Mock @/lib/utils
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));
