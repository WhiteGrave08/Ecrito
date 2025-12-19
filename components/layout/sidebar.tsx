import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PenSquare, User, LogOut, Settings } from 'lucide-react';
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
import { SidebarNav } from '@/components/layout/sidebar-nav';
import Image from 'next/image';

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50 border-r bg-background">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <Link href="/discover" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Image
                src="/images/logo.png"
                alt="Ecrito Logo"
                width={240}
                height={240}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold gradient-text">Ecrito</span>
          </Link>
        </div>

        {/* Navigation */}
        <SidebarNav />

        {/* Actions Section */}
        <div className="px-4 pt-4">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Actions
          </p>
          <Link href="/create" data-tour="create">
            <Button className="w-full btn-gradient justify-start gap-3">
              <PenSquare className="w-5 h-5" />
              Create Blog
            </Button>
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t space-y-4">
          {/* Theme & Notifications */}
          <div className="flex items-center justify-around">
            <ThemeSwitcher />
            <NotificationBell />
          </div>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3" data-tour="profile">
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
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">@{profile?.username || 'user'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
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
      </div>
    </aside>
  );
}
