import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ensureProfile } from '@/app/actions/user-actions';

export async function GET() {
  await ensureProfile();
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const profileUrl = `/profile/${profile?.username || user.id}`;

  return NextResponse.json({ profileUrl });
}
