export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header Skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Skeleton */}
              <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
              
              {/* Info Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex gap-6 pt-4">
                  <div className="space-y-1">
                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>

              {/* Follow Button Skeleton */}
              <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-8 border-b">
          <div className="h-10 w-24 bg-muted animate-pulse rounded-t" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded-t" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-t" />
        </div>

        {/* Blog Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                </div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
