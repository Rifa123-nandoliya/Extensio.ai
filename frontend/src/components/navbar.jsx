import { useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ title, subtitle, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f4f4f5]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="mt-0.5 shrink-0 rounded-xl border border-zinc-200/80 bg-white p-2 text-zinc-600 shadow-sm hover:bg-zinc-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500 lg:line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-zinc-200/80 bg-white p-2.5 text-zinc-500 shadow-sm hover:bg-zinc-50 hover:text-zinc-700"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white py-1.5 pl-1.5 pr-2.5 shadow-sm sm:pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-xs font-semibold text-white">
                {initials}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-[140px] truncate text-sm font-medium text-zinc-900 lg:max-w-none">
                  {user?.name}
                </p>
                <p className="truncate text-xs capitalize text-zinc-500">
                  {user?.subscriptionPlan} plan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-2.5 py-2.5 text-sm font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 sm:px-3"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            placeholder="Search projects…"
            className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
