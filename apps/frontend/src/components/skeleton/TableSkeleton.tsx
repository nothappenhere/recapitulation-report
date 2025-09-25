const TableSkeleton = () => {
  return (
    <>
      <div className="bg-white">
        {/* Header Control */}
        <div className="flex items-center justify-between py-4">
          <div className="animate-pulse bg-neutral-200 h-10 w-1/3 rounded"></div>

          <div className="flex justify-end items-center gap-3">
            <div className="animate-pulse bg-neutral-200 h-10 rounded px-4 flex items-center">
              <span className="mr-2 text-transparent">Lorem, ipsum.</span>
            </div>
            <div className="animate-pulse bg-neutral-200 h-10 rounded px-4 flex items-center">
              <span className="mr-2 text-transparent">Lorem, ipsum.</span>
            </div>
            <div className="animate-pulse bg-neutral-200 h-10 rounded px-4 flex items-center">
              <span className="mr-2 text-transparent">Lorem, ipsum.</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border">
          {/* Table Header */}
          <div className="flex border-b animate-pulse">
            <div className="bg-neutral-200 h-8 w-1/4 rounded m-2"></div>
            <div className="bg-neutral-200 h-8 w-1/4 rounded m-2"></div>
            <div className="bg-neutral-200 h-8 w-1/4 rounded m-2"></div>
            <div className="bg-neutral-200 h-8 w-1/4 rounded m-2"></div>
            <div className="bg-neutral-200 h-8 w-1/4 rounded m-2"></div>
          </div>
          {/* Table Body */}
          <div className="animate-pulse">
            <div className="bg-neutral-200 h-10 rounded m-2"></div>
            <div className="bg-neutral-200 h-10 rounded m-2"></div>
            <div className="bg-neutral-200 h-10 rounded m-2"></div>
            <div className="bg-neutral-200 h-10 rounded m-2"></div>
            <div className="bg-neutral-200 h-10 rounded m-2"></div>
          </div>
          {/* Table Footer */}
          <div className="flex border-t animate-pulse">
            <div className="bg-neutral-200 h-8 flex-1 rounded m-2"></div>
            <div className="bg-neutral-200 h-8 w-1/4 rounded m-2"></div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between space-x-2 py-4 px-2">
        <div className="animate-pulse bg-neutral-200 h-6 w-1/3 rounded"></div>
        <div className="animate-pulse bg-neutral-200 h-6 w-1/3 rounded"></div>
      </div>
    </>
  );
};

export default TableSkeleton;
