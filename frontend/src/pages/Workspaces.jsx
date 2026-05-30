import { useState } from "react";
import { Users, Plus, Loader2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useWorkspace } from "../hooks/useWorkspace";
import {
  createWorkspace,
  getWorkspaceMembers,
  inviteWorkspaceMember,
  removeWorkspaceMember,
} from "../services/api";
import { showSuccess } from "../utils/toast";
import { SkeletonList } from "../components/ui/Skeleton";

const Workspaces = () => {
  const {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    loading,
    setActiveWorkspace,
    refetchWorkspaces,
  } = useWorkspace();

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const loadMembers = async (workspaceId) => {
    if (!workspaceId) return;
    setMembersLoading(true);
    try {
      const data = await getWorkspaceMembers(workspaceId);
      setMembers(data.members ?? []);
    } catch {
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleSelect = async (workspaceId) => {
    await setActiveWorkspace(workspaceId);
    showSuccess("Workspace activated");
    loadMembers(workspaceId);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await createWorkspace({ name: name.trim() });
      setName("");
      await refetchWorkspaces();
      showSuccess("Workspace created");
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!activeWorkspaceId || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      await inviteWorkspaceMember(activeWorkspaceId, inviteEmail.trim(), "member");
      setInviteEmail("");
      await loadMembers(activeWorkspaceId);
      showSuccess("Member invited");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!activeWorkspaceId) return;
    await removeWorkspaceMember(activeWorkspaceId, userId);
    await loadMembers(activeWorkspaceId);
    showSuccess("Member removed");
  };

  return (
    <DashboardLayout
      title="Team workspaces"
      subtitle="Collaborate with your team in shared workspaces"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Your workspaces</h2>
          {loading ? (
            <div className="mt-4">
              <SkeletonList rows={3} />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {workspaces.map((ws) => (
                <li
                  key={ws.workspaceId}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    ws.workspaceId === activeWorkspaceId
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200/80"
                  }`}
                >
                  <div>
                    <p className="font-medium text-zinc-900">{ws.name}</p>
                    <p className="text-xs capitalize text-zinc-500">
                      {ws.role}
                      {ws.isPersonal ? " · personal" : ""}
                    </p>
                  </div>
                  {ws.workspaceId !== activeWorkspaceId && (
                    <button
                      type="button"
                      onClick={() => handleSelect(ws.workspaceId)}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Switch
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleCreate} className="mt-6 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New workspace name"
              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-zinc-600" />
            <h2 className="text-sm font-semibold text-zinc-900">
              {activeWorkspace?.name ?? "Workspace"} members
            </h2>
          </div>

          {activeWorkspaceId && (
            <button
              type="button"
              onClick={() => loadMembers(activeWorkspaceId)}
              className="mt-2 text-xs text-zinc-500 hover:text-zinc-800"
            >
              Refresh members
            </button>
          )}

          {membersLoading ? (
            <div className="mt-4">
              <SkeletonList rows={3} />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {members.map((m) => (
                <li
                  key={m.userId}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{m.name}</p>
                    <p className="text-xs text-zinc-500">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize text-zinc-500">{m.role}</span>
                    {m.role !== "owner" && activeWorkspace?.role !== "viewer" && (
                      <button
                        type="button"
                        onClick={() => handleRemove(m.userId)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeWorkspace?.role !== "viewer" && (
            <form onSubmit={handleInvite} className="mt-6 flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Invite by email"
                className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <button
                type="submit"
                disabled={inviting}
                className="rounded-xl border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
              >
                Invite
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Workspaces;
