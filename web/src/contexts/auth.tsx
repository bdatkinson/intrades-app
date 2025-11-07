"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, storage, type AuthTokens, type Profile, type LoginRequest, type RegisterRequest } from "@/lib/api";

type AuthState = {
  tokens: AuthTokens | null;
  user: Profile | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshing: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const [tokens, setTokens] = useState<AuthTokens | null>(() => storage.tokens);
  const [refreshing, setRefreshing] = useState(false);

  const setAndPersist = (t: AuthTokens | null) => {
    setTokens(t);
    storage.tokens = t;
  };

  // Fetch profile when tokens change
  const { data: user } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => api.profile(tokens?.accessToken),
    enabled: !!tokens?.accessToken,
    staleTime: 60_000,
  });

  // Background refresh every 10 minutes if refresh token available
  useEffect(() => {
    if (!tokens?.refreshToken) return;
    const id = setInterval(async () => {
      try {
        setRefreshing(true);
        const next = await api.refresh(tokens.accessToken);
        setAndPersist({ ...tokens, ...next });
      } catch {
        // token expired; clear
        setAndPersist(null);
        qc.invalidateQueries({ queryKey: ["auth", "profile"] });
      } finally {
        setRefreshing(false);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [tokens, qc]);

  const loginMutation = useMutation({
    mutationFn: (body: LoginRequest) => api.login(body),
    onSuccess: (t) => {
      setAndPersist(t);
      qc.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (body: RegisterRequest) => api.register(body),
    onSuccess: (t) => {
      setAndPersist(t);
      qc.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  const logout = useCallback(() => {
    setAndPersist(null);
    qc.invalidateQueries({ queryKey: ["auth", "profile"] });
  }, [qc]);

  const value = useMemo<AuthState>(() => ({
    tokens,
    user: user ?? null,
    login: (d) => loginMutation.mutateAsync(d).then(() => {}),
    register: (d) => registerMutation.mutateAsync(d).then(() => {}),
    logout,
    refreshing,
  }), [tokens, user, loginMutation, registerMutation, logout, refreshing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
