import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Where is Polka?",
  description: "Nálam van, vagy Ritánál?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="min-h-screen bg-cream font-sans antialiased">
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-6">
          <header className="flex items-center justify-between py-6">
            <Link href="/" className="font-serif text-lg text-ink">
              Where is Polka?
            </Link>
            <nav className="flex gap-4 text-sm text-ink/60">
              <Link href="/dashboard" className="hover:text-ink">
                Naptár
              </Link>
              <Link href="/game" className="hover:text-ink">
                Játék
              </Link>
            </nav>
          </header>
          <main className="flex-1 pb-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
