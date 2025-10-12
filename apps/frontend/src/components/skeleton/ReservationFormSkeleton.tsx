const ReservationFormSkeleton = () => {
  return (
    <>
      <div className="w-full bg-muted">
        <div className="animate-pulse rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shadow-lg">
          {/* Header */}
          <div className="relative flex justify-between items-center text-center p-4">
            <div className="w-1/2 ps-32">
              <div className="h-6 w-1/2 mx-auto bg-neutral-300 dark:bg-neutral-700 rounded mb-3"></div>
              <div className="h-4 w-11/12 mx-auto bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            </div>

            <div className="w-1/3 absolute right-4 top-4">
              <div className="h-10 w-full bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-neutral-300 dark:border-neutral-700"></div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5 p-4">
            {/* Row 1 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 2 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 3 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 4 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 5 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 6 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 7 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 8 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 9 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Submit Button */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
          </div>

          {/* Separator */}
          <div className="border-t border-neutral-300 dark:border-neutral-700"></div>

          {/* Footer */}
          <div className="text-center p-4">
            <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2 mx-auto mb-3"></div>
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-10/12 mx-auto mb-3"></div>
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationFormSkeleton;
