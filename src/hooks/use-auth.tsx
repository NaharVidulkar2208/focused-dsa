import { createContext, useContext, useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  guest: boolean;
  displayName: string | null;
  enterGuest: () => void;
  exitGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Guest mode is SESSION-based: cleared when the tab/browser is closed.
// This means guest progress is temporary and never synced across devices.
const GUEST_KEY = "dsa-focus.guest";

function getFirstName(user: User | null): string | null {
  if (!user) return null;
  const full: string =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "";
  return full.split(/\s+/)[0] || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession]   = useState<Session | null>(null);
  const [loading, setLoading]   = useState(true);
  const [guest,   setGuest]     = useState<boolean>(false);
  const initialized             = useRef(false);

  // Read guest state from sessionStorage (tab-scoped, not permanent)
  useEffect(() => {
    setGuest(sessionStorage.getItem(GUEST_KEY) === "1");
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      // Signing in clears any leftover guest flag
      if (s) { sessionStorage.removeItem(GUEST_KEY); setGuest(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const enterGuest = () => {
    sessionStorage.setItem(GUEST_KEY, "1");
    setGuest(true);
  };
  const exitGuest = () => {
    sessionStorage.removeItem(GUEST_KEY);
    setGuest(false);
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    exitGuest();
  };

  const user        = session?.user ?? null;
  const displayName = useMemo(() => getFirstName(user), [user]);

  return (
    <AuthContext.Provider value={{ session, user, loading, guest, displayName, enterGuest, exitGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
