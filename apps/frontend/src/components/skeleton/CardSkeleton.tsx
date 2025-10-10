// CardSkeleton.tsx
const CardSkeleton = () => {
  const skeletonCard = (
    <div className="animate-pulse rounded-lg border p-4 shadow-xs flex flex-col justify-between bg-muted">
      {/* Header */}
      <div>
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4 mb-12"></div>
        {/* <div className="h-5 bg-neutral-300 dark:bg-neutral-700 rounded w-1/5 mb-2.5"></div> */}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 text-sm mt-auto">
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"></div>
        <div className="h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded w-full"></div>
        <div className="h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded w-full"></div>
        <div className="h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>{skeletonCard}</div>
      ))}
    </div>
  );
};

export default CardSkeleton;
