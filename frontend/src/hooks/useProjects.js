import { useCallback, useEffect, useState } from "react";
import { getProjects } from "../services/api";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const removeProjectLocally = useCallback((projectId) => {
    setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    removeProjectLocally,
  };
};
