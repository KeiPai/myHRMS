import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

export interface ScreenLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbEntry[];
}

export const ScreenLayout = React.forwardRef<HTMLDivElement, ScreenLayoutProps>(
  ({ children, className, title, description, actions, breadcrumbs, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge('space-y-6', className)} {...props}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <svg
                    className="h-4 w-4 text-muted-foreground shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {(title || description || actions) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              )}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        <div>{children}</div>
      </div>
    );
  }
);

ScreenLayout.displayName = 'ScreenLayout';
