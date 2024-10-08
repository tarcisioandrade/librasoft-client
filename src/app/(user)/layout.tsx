import Header from "@/components/header";
import Page from "@/components/page";
import { getSession } from "@/services/session.service";
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
      <Page container="container-secondary" asChild>
        <section>
          <p className="my-6 text-sm">
            Olá <strong>{session?.user.name}</strong>! Acompanhe aqui seus dados cadastrais.
            {session?.user.role === "Admin" ? (
              <span className="block text-red-500">
                Você está conectado em uma conta de administrador.
              </span>
            ) : null}
          </p>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[400px_1fr]">
            <aside className="border lg:self-start">
              <nav>
                <ul>
                  <li>
                    <Link
                      href="/account/personal-data"
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
      </Page>
    </>
  );
};

export default AccountLayout;
