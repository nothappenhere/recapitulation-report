const FormSkeleton = () => {
  return (
    <div className="flex justify-center items-center mt-16 transition-opacity duration-300">
      <div className="w-full max-w-sm bg-muted">
        <div className="animate-pulse rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shadow-lg">
          {/* Header */}
          <div className="p-4">
            <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"></div>
          </div>

          {/* Separator */}
          <div className="border-t border-neutral-300 dark:border-neutral-700"></div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5 p-4">
            {/* Row 1 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Row 2 */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
            {/* Submit Button */}
            <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
