import { createClient } from '@/lib/supabase/server';
import { InfiniteDiscoverGrid } from '@/components/discover/infinite-discover-grid';
import { DiscoverFilters } from '@/components/discover/filter-bar';
import { redirect } from 'next/navigation';

interface DiscoverPageProps {
  searchParams: Promise<{
    filter?: string;
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get filter from search params
  const { filter = 'all' } = await searchParams;

  let blogs;

  if (filter === 'following') {
    // First, get the list of followed user IDs
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followedUserIds = follows?.map(f => f.following_id) || [];

    if (followedUserIds.length > 0) {
      // Fetch blogs from followed users
      const { data: followedBlogs } = await supabase
        .from('blogs')
        .select(`
          *,
          author:profiles!author_id(username, full_name, avatar_url),
          tags:blog_tags(tag_name),
          likes_count:blog_likes(count)
        `)
        .eq('published', true)
        .in('author_id', followedUserIds)
        .order('published_at', { ascending: false })
        .limit(9);

      blogs = followedBlogs || [];
    } else {
      blogs = [];
    }

  } else if (filter === 'popular') {
    // Fetch blogs sorted by likes
    const { data: popularBlogs } = await supabase
      .from('blogs')
      .select(`
        *,
        author:profiles!author_id(username, full_name, avatar_url),
        tags:blog_tags(tag_name),
        likes_count:blog_likes(count)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(9);

    blogs = popularBlogs || [];

  } else {
    // Default: All posts
    const { data: allBlogs } = await supabase
      .from('blogs')
      .select(`
        *,
        author:profiles!author_id(username, full_name, avatar_url),
        tags:blog_tags(tag_name),
        likes_count:blog_likes(count)
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(9);

    blogs = allBlogs || [];
  }

  // Transform the data to match BlogCard props
  const transformedBlogs = blogs?.map((blog: any) => ({
    ...blog,
    author: Array.isArray(blog.author) ? blog.author[0] : blog.author,
    likes_count: Array.isArray(blog.likes_count) ? blog.likes_count.length : 0,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover</h1>
          <p className="text-muted-foreground text-lg">
            Explore amazing stories, insights, and ideas from writers around the world.
          </p>
        </div>

        {/* Filters */}
        <DiscoverFilters />

        {/* Infinite Scroll Blog Grid */}
        <InfiniteDiscoverGrid initialBlogs={transformedBlogs} filter={filter} />
      </div>
    </div>
  );
}
