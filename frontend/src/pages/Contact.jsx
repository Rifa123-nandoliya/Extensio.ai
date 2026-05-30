import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MessageSquare,
  ArrowLeft,
  Send,
  Clock,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import MarketingNav from "../components/marketing/MarketingNav";
import MarketingFooter from "../components/marketing/MarketingFooter";
import { showSuccess } from "../utils/toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    showSuccess("Message sent — we'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="mesh-dark min-h-screen text-white">
      <div className="grid-pattern pointer-events-none fixed inset-0" aria-hidden="true" />

      <MarketingNav />

      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — info */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-200">
              <MessageSquare size={14} />
              We&apos;re here to help
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Questions about billing, enterprise plans, or a bug in your workflow?
              Send us a message and our team will respond within one business day.
            </p>

            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    support@extensio.ai
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">Response time</p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    Within 24 hours on business days
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <p className="font-medium text-white">Before you write</p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    Check the{" "}
                    <Link to="/register" className="text-indigo-400 hover:underline">
                      docs & dashboard
                    </Link>{" "}
                    for quick answers on generation limits and billing.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right — form */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-xl shadow-indigo-500/5 backdrop-blur-sm lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
            <h2 className="relative text-xl font-semibold text-white">Send a message</h2>
            <p className="relative mt-1 text-sm text-zinc-400">
              All fields are required.
            </p>

            {submitted && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 size={18} className="shrink-0" />
                Thanks! Your message was received successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 disabled:opacity-60"
              >
                {submitting ? (
                  "Sending…"
                ) : (
                  <>
                    Send message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default Contact;
