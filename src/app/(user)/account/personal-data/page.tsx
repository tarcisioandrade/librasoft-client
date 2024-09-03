import { getSession } from "@/services/session";
import React from "react";
import FormUserData from "./components/form-user-data";

const AccountPage = async () => {
  const session = await getSession();

  return (
    <>
      <header className="w-full bg-secondary px-4 py-2">
        <p className="text-sm text-muted-foreground">Dados Pessoais</p>
      </header>
      {session?.user ? <FormUserData user={session.user} /> : null}
    </>
  );
};

export default AccountPage;
