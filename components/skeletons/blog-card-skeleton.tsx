import { Card } from '@/components/ui/card';

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      {/* Cover Image Skeleton */}
      <div className="h-48 skeleton" />
      
      <div className="p-6 space-y-4">
        {/* Tags Skeleton */}
        <div className="flex gap-2">
          <div className="h-5 w-16 skeleton rounded-full" />
          <div className="h-5 w-20 skeleton rounded-full" />
          <div className="h-5 w-14 skeleton rounded-full" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 skeleton rounded w-full" />
          <div className="h-6 skeleton rounded w-3/4" />
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-2/3" />
        </div>

        {/* Author Skeleton */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 skeleton rounded" />
            <div className="h-3 w-20 skeleton rounded" />
          </div>
        </div>

        {/* Meta Skeleton */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
          <div className="h-4 w-12 skeleton rounded" />
          <div className="h-4 w-12 skeleton rounded" />
          <div className="h-4 w-16 ml-auto skeleton rounded" />
        </div>
      </div>
    </Card>
  );
}

export function BlogCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
