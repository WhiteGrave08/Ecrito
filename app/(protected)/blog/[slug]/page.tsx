import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LikeButton } from '@/components/blog/like-button';
import { FollowButton } from '@/components/blog/follow-button';
import { ShareButton } from '@/components/blog/share-button';
import { BookmarkButton } from '@/components/blog/bookmark-button';
import { CommentForm } from '@/components/blog/comment-form';
import { CommentList } from '@/components/blog/comment-list';
import { SocialShare } from '@/components/blog/social-share';
import { ViewTracker } from '@/components/blog/view-tracker';

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}



export default async function BlogPage({ params }: BlogPageProps) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Await params
  const { slug } = await params;

  // Fetch blog by slug
  const { data: blog, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:profiles!author_id(id, username, full_name, avatar_url, bio),
      tags:blog_tags(tag_name),
      likes_count:blog_likes(count),
      is_liked:blog_likes(user_id)
    `)
    .eq('slug', slug)
    .single();

  if (error || !blog) {
    console.error('Blog fetch error:', error);
    notFound();
  }

  // Check if user can view this blog
  if (!blog.published && blog.author_id !== user.id) {
    notFound();
  }

  // Transform data
  const author = Array.isArray(blog.author) ? blog.author[0] : blog.author;
  const likesCount = Array.isArray(blog.likes_count) && blog.likes_count.length > 0
    ? (blog.likes_count[0] as any).count 
    : 0;
  const isLiked = Array.isArray(blog.is_liked) && blog.is_liked.some((like: any) => like.user_id === user.id);

  // Check if following author
  const { data: followData } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', author.id)
    .single();
  
  const isFollowing = !!followData;

  // Check if bookmarked
  const { data: bookmarkData } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('blog_id', blog.id)
    .single();
  
  const isBookmarked = !!bookmarkData;

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!user_id(username, full_name, avatar_url)
    `)
    .eq('blog_id', blog.id)
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-4xl mx-auto px-4 py-8">
        <ViewTracker blogId={blog.id} />
        {/* Cover Image */}
        {blog.cover_image_url && (
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag: any) => (
                <Badge key={tag.tag_name} variant="secondary">
                  {tag.tag_name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 leading-tight">{blog.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {blog.reading_time} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.view_count} views
            </span>
            <span>
              {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pb-6 border-b">
            <LikeButton blogId={blog.id} initialLiked={isLiked} initialCount={likesCount} />
            <BookmarkButton blogId={blog.id} initialBookmarked={isBookmarked} />
            <ShareButton slug={blog.slug} title={''} />
          </div>

          {/* Social Share */}
          <div className="mt-6">
            <SocialShare title={blog.title} slug={blog.slug} />
          </div>
        </header>

        {/* Author Card */}
        <div className="flex items-center justify-between p-6 glass-card mb-8">
          <div className="flex items-center gap-4">
            {author.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-semibold">
                  {author.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg">{author.full_name}</h3>
              <p className="text-sm text-muted-foreground">@{author.username}</p>
              {author.bio && (
                <p className="text-sm text-muted-foreground mt-1">{author.bio}</p>
              )}
            </div>
          </div>
          {author.id !== user.id && (
            <FollowButton userId={author.id} initialFollowing={isFollowing} />
          )}
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Comments Section */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">
            Comments ({comments?.length || 0})
          </h2>
          
          {/* Comment Form */}
          <div className="mb-8">
            <CommentForm blogId={blog.id} />
          </div>

          {/* Comments List */}
          {comments && comments.length > 0 && (
            <CommentList comments={comments} currentUserId={user.id} blogId={blog.id} />
          )}
        </div>
      </article>
    </div>
  );
}
