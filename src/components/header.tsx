import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchHomePage from "./search-home-page";
import { ChevronDown, CircleAlert, Database, LibraryBig } from "lucide-react";
import { headers } from "next/headers";
import { getSession, logout } from "@/services/session.service";
import { Button } from "./ui/button";
import { BagService } from "@/services/bag.service";
import { EUserRole } from "@/enums/EUserRole";
import colors from "tailwindcss/colors";
import { cn } from "@/lib/utils";

const Header = async () => {
  const session = await getSession();
  const callbackUrl = headers().get("x-current-path");
  let bagCount: number | null = null;
  let IS_PROFILE_COMPLETE: boolean | null = null;
  if (session) {
    const bagService = new BagService();
    bagCount = (await bagService.GetAll())?.data.length ?? 0;
    IS_PROFILE_COMPLETE = !!session.user.address;
  }

  return (
    <header className="border-b">
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
            <Button className="flex border-none text-sm outline-none" variant="link">
              <strong className="relative pr-2">
                {session ? `Olá, ${session.user.name}` : "Olá, faça seu login."}
                {session && !IS_PROFILE_COMPLETE ? (
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
            <section className="px-4 py-2">
              <span className="font-semibold">Sua Conta</span>
              <ul className="mt-2 flex flex-col gap-2 text-xs">
                <li>
                  <a
                    className={cn(
                      "block text-muted-foreground hover:text-primary hover:underline",
                      !IS_PROFILE_COMPLETE && "flex justify-between",
                    )}
                    href="/account/personal-data"
                  >
                    <span>Sua conta</span>
                    {session && !IS_PROFILE_COMPLETE ? (
                      <CircleAlert fill={colors.red[500]} color="#fff" size={14} />
                    ) : null}
                  </a>
                </li>
                <li>
                  <a
                    className="block text-muted-foreground hover:text-primary hover:underline"
                    href={"/rent"}
                  >
                    Meus Alugúeis
                  </a>
                </li>
                {session ? (
                  <li>
                    <form
                      action={async () => {
                        "use server";
                        logout();
                      }}
                    >
                      <input
                        type="submit"
                        className="block cursor-pointer text-muted-foreground hover:text-primary hover:underline"
                        value="Sair"
                      />
                    </form>
                  </li>
                ) : null}
              </ul>
            </section>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
