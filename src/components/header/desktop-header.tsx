"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchHomePage from "../search-home-page";
import { ChevronDown, CircleAlert, Database, LibraryBig } from "lucide-react";
import { Button } from "../ui/button";
import { EUserRole } from "@/enums/EUserRole";
import colors from "tailwindcss/colors";
import { cn } from "@/lib/utils";
import { logouAction } from "@/actions/auth/logout.action";
import { HeaderProps } from "@/types/Header";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

const DesktopHeader = ({
  session,
  callbackUrl,
  bagCount,
  profileStatus,
  categories,
}: HeaderProps) => {
  const pathname = usePathname();
  const SLICE_COUNT = 8;
  const MORE_CATEGORIES = categories.slice(SLICE_COUNT);
  const IS_HOMEPAGE = pathname.endsWith("/");

  return (
    <div className="hidden lg:block">
      <div className="border-b">
        <div className="container flex h-14 items-center justify-between gap-10">
          <a href="/?pageNumber=1" className="text-2xl font-bold">
            LibraSoft
          </a>
          <SearchHomePage />
          {session?.user.role === EUserRole.Admin ? (
            <a
              href="/dashboard"
              className="group relative flex items-center gap-1 rounded border p-1 hover:bg-secondary/50"
            >
              <p className="sr-only">Dashboard</p>
              <Database />
            </a>
          ) : null}
          <a
            href="/bag"
            className="group relative flex items-center gap-1 rounded border p-1 hover:bg-secondary/50"
          >
            <p className="sr-only">Bolsa</p>
            {bagCount ? (
              <span className="absolute right-[-10px] top-[-8px] h-[14px] w-[12px] rounded-full bg-primary text-center text-[10px] text-white group-hover:bg-primary/90">
                {bagCount}
              </span>
            ) : null}
            <LibraryBig />
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="group [&[data-state=open]>.svg-to-rotate]:rotate-180"
            >
              <Button className="-ml-4 flex border-none text-sm outline-none" variant="link">
                <strong className="relative pr-2">
                  {session ? `Olá, ${session.user.name}` : "Olá, faça seu login."}
                  {session && !profileStatus ? (
                    <CircleAlert
                      className="absolute -top-2 right-0 group-[&[data-state=open]]:hidden"
                      color="#fff"
                      fill={colors.red[500]}
                      size={14}
                    />
                  ) : null}
                </strong>
                <ChevronDown className="svg-to-rotate transition-all" size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 text-sm">
              {!session ? (
                <header className="border-b">
                  <div className="p-4">
                    <a
                      href={`/signin?callbackUrl=${callbackUrl}`}
                      className="mx-auto block w-[80%] rounded bg-primary p-2 text-center text-white hover:bg-primary/90"
                    >
                      Faça seu Login
                    </a>
                    <div className="mt-2 text-center text-xs">
                      Novo aqui?{" "}
                      <a href="/signup" className="text-blue-500 hover:underline">
                        Cadastre-se
                      </a>
                    </div>
                  </div>
                </header>
              ) : null}
              <nav className="px-4 py-2">
                <span className="font-semibold">Sua Conta</span>
                <ul className="mt-2 flex flex-col gap-2 text-xs">
                  <li>
                    <a
                      className={cn(
                        "block text-muted-foreground hover:text-primary hover:underline",
                        !profileStatus && "flex justify-between",
                      )}
                      href="/account/personal-data"
                    >
                      <span>Sua conta</span>
                      {session && !profileStatus ? (
                        <CircleAlert fill={colors.red[500]} color="#fff" size={14} />
                      ) : null}
                    </a>
                  </li>
                  <li>
                    <a
                      className="block text-muted-foreground hover:text-primary hover:underline"
                      href={"/rent"}
                    >
                      Meus Aluguéis
                    </a>
                  </li>
                  {session ? (
                    <li>
                      <form action={logouAction}>
                        <input
                          type="submit"
                          className="block cursor-pointer text-muted-foreground hover:text-primary hover:underline"
                          value="Sair"
                        />
                      </form>
                    </li>
                  ) : null}
                </ul>
              </nav>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* MenuCategories */}
      {IS_HOMEPAGE ? (
        <nav className="border-b">
          <div className="container h-10">
            <ul className="flex h-full items-center justify-center gap-6">
              {categories.slice(0, SLICE_COUNT).map((categ) => (
                <li className="text-sm" key={categ.id}>
                  <a
                    className="select-none hover:underline"
                    href={`/?category=${categ.title.toLowerCase()}`}
                  >
                    {categ.title}
                  </a>
                </li>
              ))}
              {MORE_CATEGORIES.length ? (
                <li className="-ml-4">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger asChild>
                          <div className="flex select-none items-center gap-1 font-semibold">
                            <Menu />
                            Mais Categorias
                          </div>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[300px] grid-cols-2 p-2">
                            {MORE_CATEGORIES.map((categ) => (
                              <li className="text-sm" key={categ.id}>
                                <NavigationMenuLink asChild>
                                  <a
                                    href={`/?category=${categ.title.toLowerCase()}`}
                                    className="block select-none whitespace-nowrap p-2 hover:underline"
                                  >
                                    {categ.title}
                                  </a>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      ) : null}
    </div>
  );
};

export default DesktopHeader;
