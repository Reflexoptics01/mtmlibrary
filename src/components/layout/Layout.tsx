import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-emerald-900/20 bg-emerald-950 text-emerald-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-900 shadow-sm" aria-hidden="true">م</span>
                <span>Maktaba</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-100/80">
                Simple, self-hosted library management for Muslim institutes, schools, and madrasas.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h2>
              <div className="mt-4 grid gap-3 text-sm text-emerald-100/80">
                <Link href="/books" className="transition hover:text-white">Books</Link>
                <Link href="/risala" className="transition hover:text-white">Publications</Link>
                <Link href="/about" className="transition hover:text-white">About Maktaba</Link>
              </div>
            </nav>
            <nav aria-label="Support navigation">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h2>
              <div className="mt-4 grid gap-3 text-sm text-emerald-100/80">
                <Link href="/help" className="transition hover:text-white">Help &amp; support</Link>
                <Link href="/auth/login" className="transition hover:text-white">Staff login</Link>
                <span>Open source · MIT licensed</span>
              </div>
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-emerald-100/60 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Maktaba. Built for independent institutes.</p>
            <p>Each installation uses its own Supabase project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
