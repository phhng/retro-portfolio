import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCurrentAccount, requestEmailSignIn } from "../services/scoreApi";

interface AuthContextValue {
  email: string | null;
  isLoading: boolean;
  loadError: string | null;
  requestSignIn: (email: string) => Promise<void>;
  completeSignIn: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void getCurrentAccount()
      .then((account) => {
        if (isCurrent) setEmail(account?.email ?? null);
      })
      .catch(() => {
        if (isCurrent) {
          setEmail(null);
          setLoadError("Could not check your account. Check the score API connection and reload.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const requestSignIn = useCallback(async (address: string) => {
    await requestEmailSignIn(address);
  }, []);

  const completeSignIn = useCallback((address: string) => {
    setEmail(address);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("retro-portfolio-auth-token");
    localStorage.removeItem("retro-portfolio-account-email");
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({ email, isLoading, loadError, requestSignIn, completeSignIn, signOut }),
    [email, isLoading, loadError, requestSignIn, completeSignIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
