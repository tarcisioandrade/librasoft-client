import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SheetBagSkeleton = () => {
  return (
    <div className="flex gap-6">
      <Skeleton className="h-[150px] w-[110px]" />
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[220px]" />
          <Skeleton className="h-3 w-[120px]" />
          <Skeleton className="h-2 w-[60px]" />
          <Skeleton className="h-2 w-[55px]" />
          <Skeleton className="h-2 w-[45px]" />
        </div>
        <Skeleton className="h-2 w-[35px]" />
      </div>
    </div>
  );
};

export default SheetBagSkeleton;
