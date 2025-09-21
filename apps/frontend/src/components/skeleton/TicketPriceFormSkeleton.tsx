const TicketPriceFormSkeleton = () => {
  return (
    <>
      <div className="flex justify-center items-center mt-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="animate-pulse bg-neutral-200 rounded-lg">
            {/* Header */}
            <div className="p-4">
              <div className="h-6 bg-neutral-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-neutral-300 rounded w-3/4"></div>
            </div>

            <div className="border-t border-neutral-300"></div>

            <div className="flex flex-col gap-5 p-4">
              {/* Row 1 */}
              <div className="grid gap-3">
                <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
              </div>
              {/* Row 2 */}
              <div className="grid gap-3">
                <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
              </div>
              {/* Row 3 */}
              <div className="grid gap-3">
                <div className="h-10 bg-neutral-300 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketPriceFormSkeleton;
