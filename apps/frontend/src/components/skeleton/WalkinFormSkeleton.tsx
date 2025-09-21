const WalkinFormSkeleton = () => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg border">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="h-6 w-1/2 bg-neutral-300 animate-pulse mx-auto rounded"></div>
          <div className="h-4 w-1/3 bg-neutral-200 animate-pulse mx-auto rounded mt-2"></div>
        </div>

        <div className="border-t border-neutral-300 my-4"></div>

        <div className="flex flex-col gap-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 2 */}
          <div className="grid gap-3">
            <div className="h-16 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 4 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 5 */}
          <div className="grid gap-3">
            <div className="h-16 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 6 */}
          <div className="grid grid-cols-5 gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 7 */}
          <div className="grid grid-cols-5 gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Row 8 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
          {/* Submit Button */}
          <div className="grid gap-3">
            <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalkinFormSkeleton;
