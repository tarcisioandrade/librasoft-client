import Header from "@/components/header";
import { getSession } from "@/services/session";
import { CircleUserRound, LockKeyhole, Scale } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const AccountLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getSession();
  if (!session) redirect("/signin");

  return (
    <>
      <Header />
      <section className="container-secondary">
        <p className="my-6 text-sm">
          Olá <strong>{session?.user.name}</strong>! Acompanhe aqui seus dados cadastrais.
        </p>
        <div className="grid grid-cols-[400px_1fr] gap-6">
          <aside className="self-start border">
            <nav>
              <ul>
                <li>
                  <Link
                    href="/account/pesonal-data"
                    className="flex items-center gap-2 p-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <CircleUserRound />
                    <span>Dados Pessoais</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/change-password"
                    className="flex items-center gap-2 p-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <LockKeyhole />
                    <span>Alterar Senha</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/punishments"
                    className="flex items-center gap-2 p-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <Scale />
                    <span>Histórico de Punições</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <div className="border pb-4">{children}</div>
        </div>
      </section>
    </>
  );
};

export default AccountLayout;
