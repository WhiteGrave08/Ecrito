'use server';

import { createClient } from '@/lib/supabase/server';

export async function ensureProfile() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Not authenticated' };
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (existingProfile) {
    return { exists: true };
  }

  // Create profile if it doesn't exist
  const username = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  const { error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username: username,
      full_name: fullName,
      avatar_url: user.user_metadata?.avatar_url || null,
      bio: null,
    });

  if (insertError) {
    // If username already exists, try with a random suffix
    if (insertError.code === '23505') {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const { error: retryError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: `${username}_${randomSuffix}`,
          full_name: fullName,
          avatar_url: user.user_metadata?.avatar_url || null,
          bio: null,
        });

      if (retryError) {
        return { error: retryError.message };
      }
    } else {
      return { error: insertError.message };
    }
  }

  return { created: true };
}
