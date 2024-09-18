import React from "react";
import SearchHomePage from "../search-home-page";
import { ChevronRight, CircleAlert, Database, LibraryBig, Menu, User } from "lucide-react";
import { EUserRole } from "@/enums/EUserRole";
import colors from "tailwindcss/colors";
import { cn } from "@/lib/utils";
import { logouAction } from "@/actions/auth/logout.action";
import { HeaderProps } from "@/types/Header";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

const MobileHeader = ({
  session,
  callbackUrl,
  bagCount,
  categories,
  profileStatus,
}: HeaderProps) => {
  return (
    <div className="container fixed left-0 right-0 top-0 z-10 h-[105px] bg-background pb-2 lg:hidden">
      <div className="flex h-14 items-center justify-between gap-2">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll p-0 pb-24" side="left" hiddenCloseButton>
            <SheetHeader className="flex justify-center space-y-0 border-b px-2">
              {session ? null : (
                <a
                  className="flex h-12 items-center justify-between"
                  href={`/signin?callbackUrl=${callbackUrl}`}
                >
                  <div className="flex items-center gap-2">
                    <User className="rounded border p-1 hover:bg-secondary/50" />

                    <p className="text-sm">Faça seu login.</p>
                  </div>
                  <ChevronRight size={18} />
                </a>
              )}
            </SheetHeader>
            <nav>
              <ul>
                <li className="flex h-12 items-center border-b px-2 text-muted-foreground">
                  Categorias
                </li>
                {categories?.map((categ) => (
                  <li className="border-b" key={categ.id}>
                    <a
                      className="flex h-12 select-none items-center px-2 text-sm hover:underline"
                      href={`/?category=${categ.title.toLowerCase()}`}
                    >
                      {categ.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
        <a href="/?pageNumber=1" className="text-2xl font-bold">
          LibraSoft
        </a>
        <nav className="flex items-center gap-4">
          {session?.user.role === EUserRole.Admin ? (
            <a
              href="/dashboard"
              className="group relative hidden items-center gap-1 rounded border p-1 hover:bg-secondary/50 lg:flex"
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
          {session ? (
            <Sheet>
              <SheetTrigger>
                <div className="group relative flex items-center gap-1 rounded border p-1 hover:bg-secondary/50">
                  <User />
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetHeader className="flex h-12 justify-center space-y-0 border-b px-2 text-left">
                  <strong>{`Olá, ${session.user.name}.`}</strong>
                </SheetHeader>
                <ul>
                  <li className="flex h-12 items-center border-b px-2 text-muted-foreground">
                    Sua Conta
                  </li>
                  <li className="border-b">
                    <a
                      className="flex h-12 select-none items-center px-2 text-sm hover:text-primary hover:underline"
                      href={"/rent"}
                    >
                      Meus Aluguéis
                    </a>
                  </li>
                  <li className="border-b">
                    <a
                      className={cn(
                        "flex h-12 select-none items-center px-2 text-sm hover:text-primary hover:underline",
                        !profileStatus && "justify-between",
                      )}
                      href="/account/personal-data"
                    >
                      <span>Sua conta</span>
                      {session && !profileStatus ? (
                        <CircleAlert fill={colors.red[500]} color="#fff" size={14} />
                      ) : null}
                    </a>
                  </li>
                  <li className="border-b">
                    <form action={logouAction}>
                      <input
                        type="submit"
                        className="block h-12 cursor-pointer px-2 text-sm hover:text-primary hover:underline"
                        value="Sair"
                      />
                    </form>
                  </li>
                </ul>
              </SheetContent>
            </Sheet>
          ) : null}
        </nav>
      </div>
      <SearchHomePage />
    </div>
  );
};

export default MobileHeader;
