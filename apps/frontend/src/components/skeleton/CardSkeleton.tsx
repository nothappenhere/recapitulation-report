const CardSkeleton = () => {
  return (
    <>
      <div className="bg-white grid grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="animate-pulse bg-neutral-200 rounded-lg p-4">
          <div className="h-5 bg-neutral-300 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-neutral-300 rounded w-1/4 mb-8"></div>

          <div className="flex-col items-start gap-1.5 text-sm">
            <div className="h-4 bg-neutral-300 rounded w-1/2 mb-2"></div>
            <div className="flex flex-col gap-1">
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="animate-pulse bg-neutral-200 rounded-lg p-4">
          <div className="h-5 bg-neutral-300 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-neutral-300 rounded w-1/4 mb-8"></div>

          <div className="flex-col items-start gap-1.5 text-sm">
            <div className="h-4 bg-neutral-300 rounded w-1/2 mb-2"></div>
            <div className="flex flex-col gap-1">
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="animate-pulse bg-neutral-200 rounded-lg p-4">
          <div className="h-5 bg-neutral-300 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-neutral-300 rounded w-1/4 mb-8"></div>

          <div className="flex-col items-start gap-1.5 text-sm">
            <div className="h-4 bg-neutral-300 rounded w-1/2 mb-2"></div>
            <div className="flex flex-col gap-1">
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="animate-pulse bg-neutral-200 rounded-lg p-4">
          <div className="h-5 bg-neutral-300 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-neutral-300 rounded w-1/4 mb-8"></div>

          <div className="flex-col items-start gap-1.5 text-sm">
            <div className="h-4 bg-neutral-300 rounded w-1/2 mb-2"></div>
            <div className="flex flex-col gap-1">
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
              <div className="h-6 bg-neutral-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardSkeleton;
