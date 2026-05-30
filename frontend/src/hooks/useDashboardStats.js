import { useCallback, useEffect, useMemo, useState } from "react";
import { useProjects } from "./useProjects";
import { getTemplatesUsedCount } from "./useDownloads";
import { getDownloadAnalytics } from "../services/api";

const isThisMonth = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const useDashboardStats = () => {
  const { projects, loading: projectsLoading, error } = useProjects();
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const data = await getDownloadAnalytics();
      setAnalytics(data.analytics);
    } catch {
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = useMemo(() => {
    const templatesUsed = getTemplatesUsedCount();

    const generationsThisMonth = projects.filter((p) =>
      isThisMonth(p.createdAt)
    ).length;

    return {
      totalProjects: projects.length,
      totalDownloads: analytics?.totalDownloads ?? 0,
      downloadsThisMonth: analytics?.downloadsThisMonth ?? 0,
      templatesUsed,
      generationsThisMonth,
      recentProjects: projects.slice(0, 5),
      recentDownloads: analytics?.recentDownloads ?? [],
    };
  }, [projects, analytics]);

  return {
    ...stats,
    loading: projectsLoading || analyticsLoading,
    error,
    projects,
    refetchAnalytics: fetchAnalytics,
  };
};
