'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, PenSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  profileUrl: string;
}

export function MobileNav({ profileUrl }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around h-16 px-4">
        <Link
          href="/discover"
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
            isActive('/discover')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Compass className="w-5 h-5" />
          <span className="text-xs font-medium">Discover</span>
        </Link>

        <Link
          href="/search"
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
            isActive('/search')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs font-medium">Search</span>
        </Link>

        <Link
          href="/create"
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
        >
          <div className="w-12 h-12 -mt-6 rounded-full btn-gradient flex items-center justify-center shadow-lg">
            <PenSquare className="w-5 h-5 text-white" />
          </div>
        </Link>

        <Link
          href={profileUrl}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
            isActive('/profile')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

