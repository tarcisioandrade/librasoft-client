import React from "react";
import ChangePasswordForm from "./components/change-password-form";

const ChangePasswordPage = () => {
  return (
    <>
      <header className="w-full bg-secondary px-4 py-2">
        <p className="text-sm text-muted-foreground">Alterar Senha</p>
      </header>
      <ChangePasswordForm />
    </>
  );
};

export default ChangePasswordPage;
