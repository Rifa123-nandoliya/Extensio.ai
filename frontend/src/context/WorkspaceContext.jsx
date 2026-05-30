import { useCallback, useEffect, useMemo, useState } from "react";
import { WorkspaceContext } from "./workspaceStore";
import { getWorkspaces, activateWorkspace as activateWorkspaceApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export const WorkspaceProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState(
    () => localStorage.getItem("activeWorkspaceId") || null
  );
  const [loading, setLoading] = useState(false);

  const fetchWorkspaces = useCallback(async () => {
    if (!isAuthenticated) {
      setWorkspaces([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getWorkspaces();
      setWorkspaces(data.workspaces ?? []);

      const stored = localStorage.getItem("activeWorkspaceId");
      const userActive = user?.activeWorkspaceId;
      const preferred = stored || userActive;
      const exists = data.workspaces?.some(
        (w) => w.workspaceId === preferred
      );

      if (preferred && exists) {
        setActiveWorkspaceIdState(preferred);
        localStorage.setItem("activeWorkspaceId", preferred);
      } else if (data.workspaces?.length) {
        const first = data.workspaces[0].workspaceId;
        setActiveWorkspaceIdState(first);
        localStorage.setItem("activeWorkspaceId", first);
      }
    } catch {
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.activeWorkspaceId]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const setActiveWorkspace = useCallback(async (workspaceId) => {
    await activateWorkspaceApi(workspaceId);
    setActiveWorkspaceIdState(workspaceId);
    localStorage.setItem("activeWorkspaceId", workspaceId);
  }, []);

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.workspaceId === activeWorkspaceId) ?? null,
    [workspaces, activeWorkspaceId]
  );

  const value = useMemo(
    () => ({
      workspaces,
      activeWorkspace,
      activeWorkspaceId,
      loading,
      setActiveWorkspace,
      refetchWorkspaces: fetchWorkspaces,
    }),
    [
      workspaces,
      activeWorkspace,
      activeWorkspaceId,
      loading,
      setActiveWorkspace,
      fetchWorkspaces,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
