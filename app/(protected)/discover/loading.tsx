import { BlogCardSkeletonGrid } from '@/components/skeletons/blog-card-skeleton';

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-2 mb-8">
          <div className="h-10 w-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-28 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Blog Grid Skeleton */}
        <BlogCardSkeletonGrid count={9} />
      </div>
    </div>
  );
}
