'use server';

import { createClient } from '@/lib/supabase/server';

export async function searchBlogs(query: string, filters?: {
  author?: string;
  tags?: string[];
  sortBy?: 'newest' | 'popular' | 'relevant';
}) {
  const supabase = await createClient();

  // Start building the query
  let dbQuery = supabase
    .from('blogs')
    .select(`
      *,
      author:profiles!author_id(username, full_name, avatar_url),
      tags:blog_tags(tag_name),
      likes_count:blog_likes(count)
    `)
    .eq('published', true);

  // Full-text search on title and content
  if (query.trim()) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
  }

  // Filter by author
  if (filters?.author) {
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', filters.author)
      .single();
    
    if (authorProfile) {
      dbQuery = dbQuery.eq('author_id', authorProfile.id);
    }
  }

  // Sort
  switch (filters?.sortBy) {
    case 'popular':
      dbQuery = dbQuery.order('view_count', { ascending: false });
      break;
    case 'newest':
    default:
      dbQuery = dbQuery.order('published_at', { ascending: false });
      break;
  }

  // Limit results
  dbQuery = dbQuery.limit(50);

  const { data: blogs, error } = await dbQuery;

  if (error) {
    console.error('Search error:', error);
    return { error: error.message };
  }

  // Filter by tags if specified (client-side filtering since we need to check array)
  let filteredBlogs = blogs || [];
  if (filters?.tags && filters.tags.length > 0) {
    filteredBlogs = filteredBlogs.filter(blog => {
      const blogTags = blog.tags?.map((t: any) => t.tag_name.toLowerCase()) || [];
      return filters.tags!.some(tag => blogTags.includes(tag.toLowerCase()));
    });
  }

  // Transform the data
  const transformedBlogs = filteredBlogs.map(blog => ({
    ...blog,
    author: Array.isArray(blog.author) ? blog.author[0] : blog.author,
    likes_count: Array.isArray(blog.likes_count) ? blog.likes_count.length : 0,
  }));

  return { blogs: transformedBlogs };
}

export async function getAuthors() {
  const supabase = await createClient();

  const { data: authors, error } = await supabase
    .from('profiles')
    .select('username, full_name')
    .order('full_name');

  if (error) {
    return { error: error.message };
  }

  return { authors };
}

export async function getTags() {
  const supabase = await createClient();

  const { data: tags, error } = await supabase
    .from('blog_tags')
    .select('tag_name')
    .order('tag_name');

  if (error) {
    return { error: error.message };
  }

  // Get unique tags
  const uniqueTags = [...new Set(tags?.map(t => t.tag_name) || [])];

  return { tags: uniqueTags };
}
