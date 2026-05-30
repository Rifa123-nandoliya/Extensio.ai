import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../hooks/useAuth";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Extensio AI workspace"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
            Create one free
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
          {!submitting && <ArrowRight size={16} />}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
