'use client';

import { PenLine, Lightbulb } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useRouter } from 'next/navigation';

export function EmptyProfile() {
  const router = useRouter();

  return (
    <EmptyState
      icon={PenLine}
      title="No Posts Yet"
      description="Start sharing your thoughts and stories with the world. Your first blog post is just a click away."
      action={{
        label: 'Create Your First Post',
        onClick: () => router.push('/create'),
        variant: 'default',
      }}
    >
      <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="p-4 glass-card text-left">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h4 className="font-semibold mb-1 text-sm">Share Your Expertise</h4>
          <p className="text-xs text-muted-foreground">
            Write about topics you're passionate about and build your audience.
          </p>
        </div>
        <div className="p-4 glass-card text-left">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
            <PenLine className="w-4 h-4 text-accent" />
          </div>
          <h4 className="font-semibold mb-1 text-sm">Rich Text Editor</h4>
          <p className="text-xs text-muted-foreground">
            Use our powerful editor with markdown support and image uploads.
          </p>
        </div>
      </div>
    </EmptyState>
  );
}
