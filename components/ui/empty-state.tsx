import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      {/* Icon */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 gradient-text">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="btn-gradient px-6 py-3"
          size="lg"
        >
          {action.label}
        </Button>
      )}

      {/* Custom Children */}
      {children}
    </div>
  );
}
