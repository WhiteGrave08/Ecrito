'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function likeBlog(blogId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Check if already liked
  const { data: existing } = await supabase
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Unlike
    const { error } = await supabase
      .from('blog_likes')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_id', user.id);

    if (error) return { error: error.message };
    
    // Get slug for revalidation
    const { data: blog } = await supabase
      .from('blogs')
      .select('slug')
      .eq('id', blogId)
      .single();

    if (blog) {
      revalidatePath(`/blog/${blog.slug}`);
    }
    revalidatePath('/discover');
    return { success: true, liked: false };
  } else {
    // Like
    const { error } = await supabase
      .from('blog_likes')
      .insert({ blog_id: blogId, user_id: user.id });

    if (error) return { error: error.message };
    
    // Get slug for revalidation
    const { data: blog } = await supabase
      .from('blogs')
      .select('slug')
      .eq('id', blogId)
      .single();

    if (blog) {
      revalidatePath(`/blog/${blog.slug}`);
    }
    revalidatePath('/discover');
    return { success: true, liked: true };
  }
}

export async function followUser(targetUserId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (user.id === targetUserId) {
    return { error: 'Cannot follow yourself' };
  }

  // Check if already following
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single();

  if (existing) {
    // Unfollow
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (error) return { error: error.message };
    
    revalidatePath('/profile/[username]', 'page');
    return { success: true, following: false };
  } else {
    // Follow
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: targetUserId });

    if (error) return { error: error.message };
    
    revalidatePath('/profile/[username]', 'page');
    return { success: true, following: true };
  }
}

export async function bookmarkBlog(blogId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Unbookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_id', user.id);

    if (error) return { error: error.message };
    
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/profile/[username]', 'page');
    return { success: true, bookmarked: false };
  } else {
    // Bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert({ blog_id: blogId, user_id: user.id });

    if (error) return { error: error.message };
    
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/profile/[username]', 'page');
    return { success: true, bookmarked: true };
  }
}
