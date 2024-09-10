import React from "react";
import ChangePasswordForm from "./components/change-password-form";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateCustomMetadata("Alterar Senha");

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
