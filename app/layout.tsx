import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniStream",
  description: "Anime streaming platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen antialiased`}>
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0b12]/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
            <Link href="/" className="text-xl font-extrabold tracking-tight">
              Ani<span className="text-pink-500">Stream</span>
            </Link>
          </div>
        </header>
        {children}
        <footer className="mt-10 border-t border-white/5 py-8 text-center text-xs text-neutral-500">
          AniStream · Portfolio project built with Next.js, Prisma and HLS · Metadata and images from AniList
        </footer>
      </body>
    </html>
  );
}