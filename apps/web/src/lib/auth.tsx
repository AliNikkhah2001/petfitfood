import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthToken,
  getAuthToken,
  getMe,
  requestOtp,
  setAuthToken,
  verifyOtp,
  type ApiCustomer,
} from "./api";

type AuthContextValue = {
  customer: ApiCustomer | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  loginViaOtp: (phone: string, code: string, name?: string) => Promise<void>;
  requestOtpCode: (phone: string) => Promise<{ debug_code?: string }>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ApiCustomer | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getAuthToken());
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const t = getAuthToken();
    if (!t) {
      setCustomer(null);
      setTokenState(null);
      return;
    }
    try {
      const me = await getMe();
      setCustomer(me);
      setTokenState(t);
    } catch {
      clearAuthToken();
      setCustomer(null);
      setTokenState(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await refreshMe();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshMe]);

  const requestOtpCode = useCallback(async (phone: string) => {
    const res = await requestOtp(phone);
    return { debug_code: res.debug_code };
  }, []);

  const loginViaOtp = useCallback(async (phone: string, code: string, name?: string) => {
    const res = await verifyOtp(phone, code, name);
    setAuthToken(res.token);
    setTokenState(res.token);
    setCustomer(res.customer);
    try {
      const me = await getMe();
      setCustomer(me);
    } catch {
      /* keep verify payload */
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setTokenState(null);
    setCustomer(null);
  }, []);

  const isAdmin = Boolean(customer?.is_admin);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      token,
      loading,
      isAdmin,
      loginViaOtp,
      requestOtpCode,
      logout,
      refreshMe,
    }),
    [customer, token, loading, isAdmin, loginViaOtp, requestOtpCode, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
