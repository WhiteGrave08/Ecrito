'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DiscoverFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-8">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        className={currentFilter === 'all' ? 'btn-gradient' : ''}
        onClick={() => handleFilterChange('all')}
      >
        All Posts
      </Button>
      <Button
        variant={currentFilter === 'following' ? 'default' : 'outline'}
        className={currentFilter === 'following' ? 'btn-gradient' : ''}
        onClick={() => handleFilterChange('following')}
      >
        Following
      </Button>
      <Button
        variant={currentFilter === 'popular' ? 'default' : 'outline'}
        className={currentFilter === 'popular' ? 'btn-gradient' : ''}
        onClick={() => handleFilterChange('popular')}
      >
        Popular
      </Button>
    </div>
  );
}
