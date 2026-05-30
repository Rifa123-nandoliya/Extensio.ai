import { useCallback, useEffect, useState } from "react";
import {
  getDownloadHistory,
  getDownloadAnalytics,
} from "../services/api";

export const useDownloadHistory = () => {
  const [downloads, setDownloads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [historyRes, analyticsRes] = await Promise.all([
        getDownloadHistory(),
        getDownloadAnalytics(),
      ]);
      setDownloads(historyRes.downloads || []);
      setAnalytics(analyticsRes.analytics || null);
    } catch (err) {
      setError(err);
      setDownloads([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    downloads,
    analytics,
    loading,
    error,
    refetch: fetchData,
  };
};

export const getProjectDownloadUrl = (projectId, source = "redownload") => {
  const base = import.meta.env.VITE_API_URL || "/api";
  const apiBase = base.endsWith("/api") ? base : `${base.replace(/\/$/, "")}/api`;
  return `${apiBase}/download/${projectId}.zip?source=${source}`;
};
