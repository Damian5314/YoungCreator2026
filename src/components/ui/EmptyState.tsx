import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

// Lege toestand: wat hier komt te staan en wat je nu kunt doen
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="mt-4 font-semibold">{title}</h2>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}
