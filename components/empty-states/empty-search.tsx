'use client';

import { Search, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EmptySearchProps {
  query?: string;
}

export function EmptySearch({ query }: EmptySearchProps) {
  const router = useRouter();

  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description={
        query
          ? `We couldn't find any blogs matching "${query}". Try different keywords or explore trending topics.`
          : "Start typing to search for blogs, authors, and topics that interest you."
      }
      action={
        query
          ? {
              label: 'Explore Discover Page',
              onClick: () => router.push('/discover'),
              variant: 'default',
            }
          : undefined
      }
    >
      {query && (
        <div className="mt-8 space-y-3">
          <p className="text-sm text-muted-foreground">Popular suggestions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['productivity', 'technology', 'design', 'writing', 'creativity'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </EmptyState>
  );
}
