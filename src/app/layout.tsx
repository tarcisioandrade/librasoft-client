import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateCustomMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </main>
        <Footer />
        <Toaster position="top-center" expand theme="light" richColors duration={2000} />
      </body>
    </html>
  );
}
