import Page from "@/components/page";
import { Button } from "@/components/ui/button";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import FormSigninWrapper from "./components/form-signin";

export const metadata: Metadata = generateCustomMetadata("Signin");

const SigninPage = () => {
  return (
    <Page container="container" withHeader={false} className="mt-12 md:w-[500px]">
      <Link href="/" className="block text-center text-2xl font-bold">
        LibraSoft
      </Link>
      <Suspense>
        <FormSigninWrapper />
      </Suspense>
      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Não tem conta?</p>
        <Button variant="secondary" className="w-full" asChild>
          <Link href="/signup">Criar Conta</Link>
        </Button>
      </div>
    </Page>
  );
};

export default SigninPage;
