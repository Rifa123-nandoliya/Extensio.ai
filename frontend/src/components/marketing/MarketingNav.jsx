import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { to: "/contact", label: "Contact" },
];

const MarketingNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <span className="truncate text-lg font-semibold tracking-tight text-white">
            Extensio AI
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:inline"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="hidden rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-100 sm:inline-flex"
          >
            Get started free
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-xl border border-white/10 p-2.5 text-zinc-300 hover:bg-white/5 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-zinc-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-900"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MarketingNav;
