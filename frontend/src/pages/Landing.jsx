import { Link } from "react-router-dom";
import {
  Zap,
  Sparkles,
  Package,
  Shield,
  ArrowRight,
  Check,
  Code2,
  Users,
  Star,
} from "lucide-react";
import MarketingNav from "../components/marketing/MarketingNav";
import MarketingFooter from "../components/marketing/MarketingFooter";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered generation",
    description:
      "Describe your extension in plain English. Get manifest, popup, content scripts, and more — validated for Manifest V3.",
  },
  {
    icon: Package,
    title: "Instant ZIP export",
    description:
      "Download a production-ready package you can load in Chrome or publish to the Web Store.",
  },
  {
    icon: Shield,
    title: "Enterprise-ready",
    description:
      "Team workspaces, version history, shared projects, and usage analytics built in.",
  },
  {
    icon: Code2,
    title: "Monaco code editor",
    description:
      "Inspect, edit, and copy every generated file with syntax highlighting before you ship.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Invite teammates, share projects, and publish templates to the marketplace.",
  },
  {
    icon: Star,
    title: "Template marketplace",
    description:
      "Start from curated blueprints or publish your own — productivity, dev tools, and more.",
  },
];

const steps = [
  {
    step: "01",
    title: "Describe your idea",
    text: "Tell the AI what your extension should do — no boilerplate required.",
  },
  {
    step: "02",
    title: "Review & refine",
    text: "Explore files in the editor, iterate with the AI assistant, or restore versions.",
  },
  {
    step: "03",
    title: "Ship it",
    text: "Download your ZIP and load it in Chrome in under a minute.",
  },
];

const plans = [
  { name: "Free", price: "$0", features: ["5 generations/day", "Basic templates", "ZIP export"] },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    featured: true,
    features: [
      "Unlimited generations",
      "Premium templates",
      "Priority AI",
      "Team workspaces",
    ],
  },
];

const Landing = () => (
  <div className="mesh-dark min-h-screen text-white">
    <div className="grid-pattern pointer-events-none fixed inset-0" aria-hidden="true" />

    <MarketingNav />

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-200">
            <Zap size={14} className="text-indigo-400" />
            Manifest V3 · Built for 2026
          </div>

          <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-7xl">
            Build Chrome extensions
            <span className="text-gradient block mt-2">10× faster with AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Extensio AI turns your idea into a complete, loadable Chrome extension —
            code, manifest, and ZIP — in minutes. No setup. No templates to wrestle with.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/register"
              className="glow-indigo inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-indigo-400 sm:w-auto sm:px-8 sm:py-4"
            >
              Start building free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto sm:px-8 sm:py-4"
            >
              Sign in to dashboard
            </Link>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            No credit card required · Free tier includes 5 generations/day
          </p>
        </div>

        {/* Product preview mock */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-1 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-zinc-500">generate — Extensio AI</span>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-zinc-950/80 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Prompt
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  &quot;Build a tab manager that groups tabs by domain with a clean popup UI…&quot;
                </p>
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                  Generated
                </p>
                <ul className="mt-2 space-y-1 font-mono text-xs text-zinc-400">
                  <li>manifest.json</li>
                  <li>popup.html · popup.js</li>
                  <li>background.js</li>
                  <li>content.js · styles.css</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to ship extensions
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            From solo builders to teams — one platform for the full lifecycle.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="glass-card group rounded-2xl p-6 transition-all hover:border-indigo-500/30 hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 transition-colors group-hover:bg-indigo-500/25">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Idea to extension in three steps
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map(({ step, title, text }) => (
            <div key={step} className="relative text-center md:text-left">
              <span className="text-5xl font-bold text-indigo-500/20">{step}</span>
              <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing teaser */}
    <section className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-zinc-400">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.featured
                  ? "border-indigo-500/50 bg-indigo-500/10 glow-indigo"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-zinc-400">{plan.period}</span>
                )}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={16} className="shrink-0 text-indigo-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to build your first extension?
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          Join builders shipping Chrome extensions faster with AI.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition-all hover:bg-zinc-100"
        >
          Create free account
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>

    <MarketingFooter />
  </div>
);

export default Landing;
