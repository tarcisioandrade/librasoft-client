import FormSignup from "@/app/(auth)/signup/components/form-signup";
import { Button } from "@/components/ui/button";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = generateCustomMetadata("Signup");

const Page = () => {
  return (
    <div className="mx-auto mt-12 w-[500px]">
      <Link href="/" className="block text-center text-2xl font-bold">
        LibraSoft
      </Link>
      <FormSignup />
      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Já tem uma conta?</p>
        <Button variant="secondary" className="w-full" asChild>
          <Link href="/signin">Faça Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
