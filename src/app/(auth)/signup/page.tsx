import FormSignupWrapper from "@/app/(auth)/signup/components/form-signup";
import Page from "@/components/page";
import { Button } from "@/components/ui/button";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = generateCustomMetadata("Signup");

const SignupPage = () => {
  return (
    <Page container="container" withHeader={false} className="mt-12 md:w-[500px]">
      <Link href="/" className="block text-center text-2xl font-bold">
        LibraSoft
      </Link>
      <FormSignupWrapper />
      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Já tem uma conta?</p>
        <Button variant="secondary" className="w-full" asChild>
          <Link href="/signin">Faça Login</Link>
        </Button>
      </div>
    </Page>
  );
};

export default SignupPage;
