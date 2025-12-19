export function CommentSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded w-full" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="flex gap-4 mt-2">
          <div className="h-3 w-12 bg-muted animate-pulse rounded" />
          <div className="h-3 w-12 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}
