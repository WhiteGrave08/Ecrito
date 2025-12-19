import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { KeyboardShortcutsProvider } from '@/components/keyboard-shortcuts-provider';
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileChecker } from '@/components/profile-checker';

async function MobileNavWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const profileUrl = `/profile/${profile?.username || user.id}`;

  return <MobileNav profileUrl={profileUrl} />;
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <KeyboardShortcutsProvider>
        <Suspense fallback={null}>
          <ProfileChecker />
        </Suspense>
        <div className="min-h-screen">
          {/* Desktop Sidebar */}
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>

          {/* Main Content */}
          <main className="md:pl-64 pb-16 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <Suspense fallback={<MobileNavSkeleton />}>
            <MobileNavWrapper />
          </Suspense>
        </div>
      </KeyboardShortcutsProvider>
    </OnboardingProvider>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50 border-r bg-background">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </aside>
  );
}

function MobileNavSkeleton() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur">
      <div className="flex items-center justify-around h-16 px-4">
        <div className="w-12 h-8 bg-muted animate-pulse rounded" />
        <div className="w-12 h-8 bg-muted animate-pulse rounded" />
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
        <div className="w-12 h-8 bg-muted animate-pulse rounded" />
      </div>
    </nav>
  );
}
