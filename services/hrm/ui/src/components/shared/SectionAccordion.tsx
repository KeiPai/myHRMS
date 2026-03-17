import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@venizia/ardor-ui-kit';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormField {
  label: string;
  value: string | undefined | null;
}

interface SectionAccordionProps {
  title: string;
  subtitle?: string;
  fields: FormField[];
  defaultOpen?: boolean;
  className?: string;
}

export function SectionAccordion({
  title,
  subtitle,
  fields,
  defaultOpen = true,
  className,
}: SectionAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={cn('overflow-hidden rounded-lg border bg-white', className)}>
      <CardHeader
        className="flex cursor-pointer flex-row items-center justify-between px-6 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>

      {isOpen && (
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground">{field.value || '\u2014'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
