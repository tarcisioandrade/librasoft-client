import FormSignin from "@/app/(auth)/signin/components/form-signin";
import { Button } from "@/components/ui/button";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";

export const metadata: Metadata = generateCustomMetadata("Signin");

const Page = () => {
  return (
    <div className="mx-auto mt-12 w-[500px]">
      <Link href="/" className="block text-center text-2xl font-bold">
        LibraSoft
      </Link>
      <Suspense>
        <FormSignin />
      </Suspense>
      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Não tem conta?</p>
        <Button variant="secondary" className="w-full" asChild>
          <Link href="/signup">Criar Conta</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
