import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import SearchHomePage from "./search-home-page";
import { ChevronDown } from "lucide-react";
import { headers } from "next/headers";
import { getSession, logout } from "@/services/session";
import { Button } from "./ui/button";

const Header = async () => {
  const session = await getSession();
  const callbackUrl = headers().get("x-current-path");

  return (
    <header className="bg-primary">
      <div className="container flex h-14 items-center justify-between gap-10">
        <Link href="/" className="font-bold text-white">
          LibraSoft
        </Link>
        <SearchHomePage />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex border-none bg-transparent text-sm text-white outline-none">
              <span>
                {session ? `Olá, ${session.user.name}` : "Olá, faça seu login."}
              </span>
              <ChevronDown size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 text-sm">
            {!session ? (
              <header className="border-b">
                <div className="p-4">
                  <Link
                    href={`/signin?callbackUrl=${callbackUrl}`}
                    className="mx-auto block w-[80%] rounded bg-primary p-2 text-center text-white"
                  >
                    Faça seu Login
                  </Link>
                  <div className="mt-2 text-center text-xs">
                    Novo aqui?{" "}
                    <Link
                      href="/signup"
                      className="text-blue-500 hover:underline"
                    >
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
                    href={"/"}
                  >
                    Sua conta
                  </Link>
                </li>
                <li>
                  <Link
                    className="block text-muted-foreground hover:text-primary hover:underline"
                    href={"/"}
                  >
                    Meus Empréstimos
                  </Link>
                </li>
                <li>
                  <Link
                    className="block text-muted-foreground hover:text-primary hover:underline"
                    href={"/"}
                  >
                    Meus Favoritos
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
                        value="Sair da conta"
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
