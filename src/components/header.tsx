import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import SearchHomePage from "./search-home-page";
import { ChevronDown, Database, LibraryBig } from "lucide-react";
import { headers } from "next/headers";
import { getSession, logout } from "@/services/session";
import { Button } from "./ui/button";
import { BagService } from "@/services/bag.service";
import { EUserRole } from "@/enums/EUserRole";

const Header = async () => {
  const session = await getSession();
  const callbackUrl = headers().get("x-current-path");
  let bagCount: number | null = null;

  if (session) {
    const bagService = new BagService();
    bagCount = (await bagService.GetAll())?.data.length ?? 0;
  }

  return (
    <header className="border-b">
      <div className="container flex h-14 items-center justify-between gap-10">
        <Link href="/?pageNumber=1" className="text-2xl font-bold">
          LibraSoft
        </Link>
        <SearchHomePage />
        {session?.user.role === EUserRole.Admin ? (
          <Link
            href="/dashboard"
            className="group relative flex items-center gap-1 rounded border p-1 hover:bg-secondary/50"
          >
            <p className="sr-only">Dashboard</p>

            <Database />
          </Link>
        ) : null}
        <Link
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
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex border-none text-sm outline-none" variant="link">
              <span>{session ? `Olá, ${session.user.name}` : "Olá, faça seu login."}</span>
              <ChevronDown size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 text-sm">
            {!session ? (
              <header className="border-b">
                <div className="p-4">
                  <Link
                    href={`/signin?callbackUrl=${callbackUrl}`}
                    className="mx-auto block w-[80%] rounded bg-primary p-2 text-center text-white hover:bg-primary/90"
                  >
                    Faça seu Login
                  </Link>
                  <div className="mt-2 text-center text-xs">
                    Novo aqui?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                      Cadastre-se
                    </Link>
                  </div>
                </div>
              </header>
            ) : null}
            <section className="px-4 py-2">
              <span className="font-semibold">Sua Conta</span>
              <ul className="mt-2 flex flex-col gap-2 text-xs">
                <li>
                  <Link
                    className="block text-muted-foreground hover:text-primary hover:underline"
                    href="/account/personal-data"
                  >
                    Sua conta
                  </Link>
                </li>
                <li>
                  <Link
                    className="block text-muted-foreground hover:text-primary hover:underline"
                    href={"/rent"}
                  >
                    Meus Alugúeis
                  </Link>
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
