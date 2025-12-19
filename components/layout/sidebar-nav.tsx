'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <nav className="flex-1 px-4 space-y-1">
      <Link
        href="/discover"
        data-tour="discover"
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive('/discover')
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-secondary'
        )}
      >
        <Compass className="w-5 h-5" />
        Discover
      </Link>

      <Link
        href="/search"
        data-tour="search"
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive('/search')
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-secondary'
        )}
      >
        <Search className="w-5 h-5" />
        Search
      </Link>
    </nav>
  );
}
