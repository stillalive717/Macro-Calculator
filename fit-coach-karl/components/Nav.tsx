"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/coach", label: "AI Coach" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lime font-bold text-xl tracking-tight">FCK</span>
          <span className="text-text-secondary text-sm font-medium hidden sm:block">Fit Coach Karl</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-lime bg-lime/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/onboarding"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-lime text-bg hover:bg-lime-dark transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
