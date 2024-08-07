"use client";

import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import {
  BarChartBig,
  Book,
  BookUser,
  ChevronRight,
  HomeIcon,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AsideBar = () => {
  const pathname = usePathname();
  const isDefaultCollapsible =
    pathname.includes("/books/list") || pathname.includes("/books/create");

  return (
    <aside className="fixed inset-0 flex w-52 flex-col border-r bg-background p-4">
      <div className="mb-6 flex items-center gap-2">
        <HomeIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">LibraSoft</span>
      </div>
      <nav className="flex flex-col gap-2">
        <Collapsible className="grid gap-4" defaultOpen={isDefaultCollapsible}>
          <CollapsibleTrigger
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground [&[data-state=open]>.svg-to-rotate]:rotate-90",
              isDefaultCollapsible && "bg-muted text-foreground",
            )}
          >
            <Book className="h-5 w-5" />
            Livros
            <ChevronRight className="svg-to-rotate ml-auto h-5 w-5 transition-all" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="-mx-3 grid gap-2 rounded-md bg-muted p-3">
              <Link
                href="/dashboard/books/list"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white",
                  pathname.includes("/books/list") && "bg-primary text-white",
                )}
                prefetch={false}
              >
                Listagem
              </Link>
              <Link
                href="/dashboard/books/create"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white",
                  pathname.includes("/books/create") && "bg-primary text-white",
                )}
                prefetch={false}
              >
                Adicionar
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
            pathname.includes("/authors") && "bg-muted text-foreground",
          )}
          prefetch={false}
        >
          <BookUser className="h-5 w-5" />
          Autores
        </Link>
        <Link
          href="/dashboard/rents/requests"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
            pathname.includes("/rents") && "bg-muted text-foreground",
          )}
          prefetch={false}
        >
          <Package className="h-5 w-5" />
          Aluguéis
        </Link>
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
            pathname.includes("/categories") && "bg-muted text-foreground",
          )}
          prefetch={false}
        >
          <BarChartBig className="h-5 w-5" />
          Categorias
        </Link>
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
            pathname.includes("/users") && "bg-muted text-foreground",
          )}
          prefetch={false}
        >
          <UserRound className="h-5 w-5" />
          Usuários
        </Link>
      </nav>
      <nav className="mt-auto">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default AsideBar;
