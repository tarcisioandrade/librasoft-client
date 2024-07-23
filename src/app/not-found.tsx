import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="container-secondary text-center">
        <h2 className="mt-6 text-3xl font-semibold">404</h2>
        <p>Página não encontrada</p>
        <Button variant="link" asChild>
          <Link href="/">Página Inicial</Link>
        </Button>
      </div>
    </>
  );
}
