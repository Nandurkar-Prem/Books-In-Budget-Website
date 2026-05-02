export default function BookSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-4/5" />
        <div className="h-4 bg-muted rounded w-3/5" />
        <div className="h-3 bg-muted rounded w-2/5" />
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 bg-muted rounded w-16" />
          <div className="h-7 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}
