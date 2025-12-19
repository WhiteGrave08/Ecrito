'use server';

import { createClient } from '@/lib/supabase/server';

export async function fetchPaginatedBlogs(page: number = 1, pageSize: number = 9, filter: string = 'all') {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized', blogs: [] };
  }

  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('blogs')
    .select(`
      *,
      author:profiles!author_id(username, full_name, avatar_url),
      tags:blog_tags(tag_name),
      likes_count:blog_likes(count)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (filter === 'following') {
    // Get followed user IDs
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = follows?.map(f => f.following_id) || [];
    
    if (followingIds.length === 0) {
      return { blogs: [] };
    }

    query = query.in('author_id', followingIds);
  } else if (filter === 'trending') {
    // Order by likes and views for trending
    query = query.order('view_count', { ascending: false });
  }

  const { data: blogs, error } = await query;

  if (error) {
    return { error: error.message, blogs: [] };
  }

  return { blogs: blogs || [] };
}
