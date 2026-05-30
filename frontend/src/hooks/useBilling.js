import { useCallback, useEffect, useState } from "react";
import { getBilling } from "../services/api";

export const useBilling = () => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBilling();
      setBilling(data.billing);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  return { billing, loading, error, refetch: fetchBilling };
};
