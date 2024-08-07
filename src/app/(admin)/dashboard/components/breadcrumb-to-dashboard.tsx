"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const BreadcrumbToDashboard = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((path, i, array) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-muted-foreground">{path}</BreadcrumbPage>
            </BreadcrumbItem>
            {i + 1 !== array.length ? <BreadcrumbSeparator /> : null}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbToDashboard;
