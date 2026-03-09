import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import type { AuthContextValue } from "../types";

const AuthContext = createContext<AuthContextValue | null>(null);

const USERNAME_KEY = "relay_username";
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USERNAME_KEY),
  );

  const login = useCallback(( newUsername: string) => {
    localStorage.setItem(USERNAME_KEY, newUsername);
    setUsername(newUsername);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USERNAME_KEY);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ username, login, logout, isAuthenticated: !!username }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be use inside AuthProvider");
  return ctx;
}
