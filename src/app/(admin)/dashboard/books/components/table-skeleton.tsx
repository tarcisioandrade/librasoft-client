import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TableSkeleton = () => {
  return (
    <>
      <header className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-36" />
      </header>
      <div className="mt-2">
        <Skeleton className="h-[800px] w-full" />
      </div>
      <div className="mt-2 flex items-center justify-end gap-4">
        <Skeleton className="h-8 w-[4.5rem]" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
    </>
  );
};

export default TableSkeleton;
