export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Image Skeleton */}
        <div className="relative h-96 rounded-2xl bg-muted animate-pulse mb-8" />

        {/* Header */}
        <header className="mb-8">
          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-3/4" />
          </div>

          {/* Meta Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-3 pb-6 border-b">
            <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
          </div>

          {/* Social Share Skeleton */}
          <div className="mt-6 flex items-center gap-2">
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
          </div>
        </header>

        {/* Author Card Skeleton */}
        <div className="flex items-center justify-between p-6 glass-card mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 mb-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-11/12" />
              <div className="h-4 bg-muted animate-pulse rounded w-10/12" />
            </div>
          ))}
        </div>

        {/* Comments Section Skeleton */}
        <div className="mt-12 border-t pt-12">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
          
          {/* Comment Form Skeleton */}
          <div className="mb-8 space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
          </div>

          {/* Comments List Skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
