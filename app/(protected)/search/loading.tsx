import { BlogCardSkeletonGrid } from '@/components/skeletons/blog-card-skeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-80 bg-muted animate-pulse rounded" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-3xl mb-8">
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-10 w-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Results Skeleton */}
        <BlogCardSkeletonGrid count={6} />
      </div>
    </div>
  );
}
