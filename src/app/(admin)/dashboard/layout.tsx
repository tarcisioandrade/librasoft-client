import React from "react";
import { Button } from "@/components/ui/button";
import AsideBar from "./components/aside-bar";
import BreadcrumbToDashboard from "./components/breadcrumb-to-dashboard";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateCustomMetadata("Dashboard");

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <AsideBar />
      <div className="flex flex-1 flex-col gap-4 py-4 pl-52">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <BreadcrumbToDashboard />
          <Button asChild variant="ghost" className="ml-auto">
            <a href="/">Página Inicial</a>
          </Button>
        </header>
        <div className="grid items-start gap-4 px-4 py-4 pb-20">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
