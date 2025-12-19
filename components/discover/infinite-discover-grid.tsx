'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { BlogCardSkeletonGrid } from '@/components/skeletons/blog-card-skeleton';
import { EmptyDiscover } from '@/components/empty-states/empty-discover';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { fetchPaginatedBlogs } from '@/app/actions/pagination-actions';
import { Loader2 } from 'lucide-react';

interface InfiniteDiscoverGridProps {
  initialBlogs: any[];
  filter: string;
}

export function InfiniteDiscoverGrid({ initialBlogs, filter }: InfiniteDiscoverGridProps) {
  const { data: blogs, isLoading, hasMore, ref } = useInfiniteScroll({
    initialData: initialBlogs,
    fetchMore: async (page) => {
      const result = await fetchPaginatedBlogs(page, 9, filter);
      return result.blogs || [];
    },
    pageSize: 9,
  });

  // Show skeleton on initial load
  if (isLoading && blogs.length === 0) {
    return <BlogCardSkeletonGrid count={9} />;
  }

  // Show empty state when following filter has no results
  if (blogs.length === 0 && !isLoading && filter === 'following') {
    return <EmptyDiscover />;
  }

  // Show generic empty state
  if (blogs.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-muted-foreground text-lg">
          No blogs found
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <div 
            key={blog.id} 
            className="stagger-item"
            style={{ animationDelay: `${(index % 9) * 50}ms` }}
          >
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more blogs...</span>
            </div>
          )}
        </div>
      )}

      {/* End of content */}
      {!hasMore && blogs.length > 0 && (
        <div className="text-center py-8 text-muted-foreground animate-fade-in">
          <p className="text-lg">You've reached the end! 🎉</p>
          <p className="text-sm mt-2">You've seen all the amazing content</p>
        </div>
      )}
    </>
  );
}
