import { useCallback, useEffect, useState } from "react";
import { getTemplates } from "../services/api";

export const useTemplates = ({ category, search } = {}) => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTemplates({ category, search });
      setTemplates(data.templates || []);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    categories,
    loading,
    error,
    refetch: fetchTemplates,
  };
};
