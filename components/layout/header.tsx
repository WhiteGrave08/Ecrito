import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PenSquare, Search, Compass, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { NotificationBell } from '@/components/layout/notification-bell';

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Ensure profile exists
  const { ensureProfile } = await import('@/app/actions/user-actions');
  await ensureProfile();

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/discover" className="text-2xl font-bold gradient-text">
          Ecrito
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/discover"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <Compass className="w-4 h-4" />
            Discover
          </Link>
          
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
          
          <Link href="/create">
            <Button className="btn-gradient">
              <PenSquare className="w-4 h-4 mr-2" />
              Create
            </Button>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <NotificationBell />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{profile?.username || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href={`/profile/${profile?.username || user.id}`} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <form action={signOut}>
                  <button type="submit" className="w-full flex items-center cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Create Button */}
        <Link href="/create" className="md:hidden">
          <Button size="sm" className="btn-gradient">
            <PenSquare className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
