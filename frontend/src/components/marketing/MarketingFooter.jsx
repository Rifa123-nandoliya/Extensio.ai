import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const MarketingFooter = () => (
  <footer className="border-t border-white/5 bg-zinc-950">
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <Zap size={16} />
            </div>
            <span className="font-semibold text-white">Extensio AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-zinc-500">
            The fastest way to go from idea to published Chrome extension.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/register" className="text-zinc-400 hover:text-white">
                  Get started
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-zinc-400 hover:text-white">
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-zinc-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-zinc-400 hover:text-white">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/5 pt-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} Extensio AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default MarketingFooter;
