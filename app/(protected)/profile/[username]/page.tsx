import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { BlogCard } from '@/components/blog/blog-card';
import { DraftBlogCard } from '@/components/blog/draft-blog-card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Heart } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}



export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Await params and searchParams
  const { username: encodedUsername } = await params;
  const { tab = 'published' } = await searchParams;
  
  // Decode username from URL (handles spaces and special characters)
  const username = decodeURIComponent(encodedUsername);

  // Fetch profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const isOwnProfile = user.id === profile.id;

  // Fetch user's blogs or bookmarked blogs based on tab
  let blogs;
  
  if (tab === 'saved' && isOwnProfile) {
    // Fetch bookmarked blogs
    const { data: bookmarkedBlogs } = await supabase
      .from('bookmarks')
      .select(`
        blog:blogs(
          *,
          author:profiles!author_id(username, full_name, avatar_url),
          tags:blog_tags(tag_name),
          likes_count:blog_likes(count)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    // Extract blogs from bookmarks
    blogs = bookmarkedBlogs?.map(b => b.blog).filter(Boolean) || [];
  } else {
    // Fetch user's blogs
    const blogsQuery = supabase
      .from('blogs')
      .select(`
        *,
        author:profiles!author_id(username, full_name, avatar_url),
        tags:blog_tags(tag_name),
        likes_count:blog_likes(count)
      `)
      .eq('author_id', profile.id)
      .order('created_at', { ascending: false });

    // Filter by published status based on tab
    if (tab === 'drafts') {
      blogsQuery.eq('published', false);
    } else {
      blogsQuery.eq('published', true).order('published_at', { ascending: false });
    }

    const { data: blogsData } = await blogsQuery;
    blogs = blogsData;
  }

  // Fetch stats
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', profile.id);

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', profile.id);

  const { count: publishedCount } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', profile.id)
    .eq('published', true);

  const { count: draftsCount } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', profile.id)
    .eq('published', false);

  const { count: bookmarksCount } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id);

  const totalViews = blogs?.reduce((sum, blog) => sum + blog.view_count, 0) || 0;
  const totalLikes = blogs?.reduce((sum, blog) => {
    const likesCount = Array.isArray(blog.likes_count) && blog.likes_count.length > 0
      ? (blog.likes_count[0] as any).count 
      : 0;
    return sum + likesCount;
  }, 0) || 0;

  // Transform blogs
  const transformedBlogs = blogs?.map(blog => ({
    ...blog,
    author: Array.isArray(blog.author) ? blog.author[0] : blog.author,
    likes_count: Array.isArray(blog.likes_count) && blog.likes_count.length > 0 
      ? (blog.likes_count[0] as any).count 
      : 0,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="glass-card p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-5xl font-semibold">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profile.full_name}</h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                {isOwnProfile ? (
                  <Button variant="outline" asChild>
                    <a href="/settings">Edit Profile</a>
                  </Button>
                ) : (
                  <Button className="btn-gradient">Follow</Button>
                )}
              </div>

              {profile.bio && (
                <p className="text-muted-foreground mb-6">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-bold">{publishedCount || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Published
                  </div>
                </div>
                {isOwnProfile && (
                  <div>
                    <div className="text-2xl font-bold">{draftsCount || 0}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Drafts
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold">{followersCount || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Followers
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{followingCount || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Following
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalLikes}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    Likes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-4 border-b">
          <Link
            href={`/profile/${username}?tab=published`}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'published'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Published {publishedCount ? `(${publishedCount})` : ''}
          </Link>
          {isOwnProfile && (
            <>
              <Link
                href={`/profile/${username}?tab=drafts`}
                className={`px-4 py-2 font-medium transition-colors ${
                  tab === 'drafts'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Drafts {draftsCount ? `(${draftsCount})` : ''}
              </Link>
              <Link
                href={`/profile/${username}?tab=saved`}
                className={`px-4 py-2 font-medium transition-colors ${
                  tab === 'saved'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Saved {bookmarksCount ? `(${bookmarksCount})` : ''}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Blogs Grid */}
      {transformedBlogs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedBlogs.map((blog) => (
            tab === 'drafts' ? (
              <DraftBlogCard key={blog.id} blog={blog} />
            ) : (
              <BlogCard key={blog.id} blog={blog} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-4">
            {tab === 'saved'
              ? "No saved blogs yet"
              : tab === 'drafts' 
                ? "No drafts yet" 
                : isOwnProfile 
                  ? "You haven't published any blogs yet" 
                  : "No blogs published yet"
            }
          </p>
          {isOwnProfile && (
            <Button asChild className="btn-gradient">
              <a href="/create">Create Your First Blog</a>
            </Button>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
