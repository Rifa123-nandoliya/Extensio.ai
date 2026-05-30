import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Download,
  Puzzle,
  CreditCard,
  Settings,
  Mail,
  X,
  Zap,
  Users,
  Store,
  MessageSquare,
  BarChart3,
  Shield,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Generate", icon: Sparkles, path: "/generate" },
  { title: "Assistant", icon: MessageSquare, path: "/assistant" },
  { title: "Projects", icon: FolderKanban, path: "/projects" },
  { title: "Downloads", icon: Download, path: "/downloads" },
  { title: "Templates", icon: Puzzle, path: "/templates" },
  { title: "Marketplace", icon: Store, path: "/marketplace" },
  { title: "Workspaces", icon: Users, path: "/workspaces" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Billing", icon: CreditCard, path: "/billing" },
];

const bottomItems = [
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Contact", icon: Mail, path: "/contact" },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-500/15 text-indigo-300 shadow-sm ring-1 ring-indigo-500/20"
        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
    }`;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Extensio AI
            </p>
            <p className="truncate text-xs text-zinc-500">
              {activeWorkspace?.name ?? `${user?.subscriptionPlan || "free"} plan`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
          Workspace
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkClass}
            onClick={onClose}
          >
            <item.icon size={18} strokeWidth={1.75} />
            {item.title}
          </NavLink>
        ))}
        {user?.role === "admin" && (
          <NavLink to="/admin" className={linkClass} onClick={onClose}>
            <Shield size={18} strokeWidth={1.75} />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="space-y-1 border-t border-white/5 p-3">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkClass}
            onClick={onClose}
          >
            <item.icon size={18} strokeWidth={1.75} />
            {item.title}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-zinc-950 transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
