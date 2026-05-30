import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="mesh-dark relative flex min-h-screen flex-col text-white">
    <div className="grid-pattern pointer-events-none fixed inset-0" aria-hidden="true" />
    <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[100px]" />

    <header className="relative z-10 px-6 py-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2.5 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <span className="text-lg font-semibold tracking-tight">Extensio AI</span>
      </Link>
    </header>

    <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-xl backdrop-blur-sm">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-zinc-400">{footer}</p>
        )}
      </div>
    </main>
  </div>
);

export default AuthLayout;
