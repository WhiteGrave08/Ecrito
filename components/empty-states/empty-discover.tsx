'use client';

import { Users, UserPlus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useRouter } from 'next/navigation';

export function EmptyDiscover() {
  const router = useRouter();

  return (
    <EmptyState
      icon={Users}
      title="Your Feed is Empty"
      description="You're not following anyone yet. Discover amazing writers and start building your personalized feed."
      action={{
        label: 'Find Writers to Follow',
        onClick: () => router.push('/search'),
        variant: 'default',
      }}
    >
      <div className="mt-8 p-6 glass-card max-w-md mx-auto">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold mb-1">Pro Tip</h4>
            <p className="text-sm text-muted-foreground">
              Follow writers whose content resonates with you to see their latest posts here.
            </p>
          </div>
        </div>
      </div>
    </EmptyState>
  );
}
