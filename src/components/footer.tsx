"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return;
  return (
    <footer className="mt-12 bg-primary py-6">
      <address className="container h-full py-2 text-center text-xs text-muted">
        <div className="space-y-4">
          <p>© {new Date().getFullYear()} LibraSoft</p>
          <p>LibraSoft Aluguéis de Livros. | CNPJ 12.345.678/0000-00</p>
          <p>
            Av. Algum Lugar, 87 - Salvador/BA CEP: 12345-67 | Fale conosco| ajuda@librasoft.com.br
          </p>
        </div>
      </address>
    </footer>
  );
};

export default Footer;
