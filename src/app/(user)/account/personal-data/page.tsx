import { getSession } from "@/services/session.service";
import { Metadata } from "next";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import FormUserDataWrapper from "./components/form-user-data";

export const metadata: Metadata = generateCustomMetadata("Minha Conta");

const AccountPage = async () => {
  const session = await getSession();

  return (
    <>
      <header className="w-full bg-secondary px-4 py-2">
        <p className="text-sm text-muted-foreground">Dados Pessoais</p>
      </header>
      {session?.user ? <FormUserDataWrapper user={session.user} /> : null}
    </>
  );
};

export default AccountPage;
