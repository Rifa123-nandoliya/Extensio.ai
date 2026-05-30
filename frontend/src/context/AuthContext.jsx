import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authStore";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, referralCode) => {
    const data = await registerRequest(name, email, password, referralCode);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
