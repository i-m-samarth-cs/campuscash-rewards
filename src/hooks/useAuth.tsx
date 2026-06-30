import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

type UserRole = 'student' | 'vendor' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: 'student' | 'vendor',
    additionalData?: Record<string, string>
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Defer role fetching with setTimeout to prevent deadlock
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setRole(null);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (data && !error) {
        setRole(data.role as UserRole);
      }
    } catch (error) {
      logger.error('Error fetching user role', error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    userRole: 'student' | 'vendor',
    additionalData?: Record<string, string>
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      // All profile/role/vendor records are created atomically by the
      // handle_new_user_role() database trigger using this metadata.
      // No client-side inserts are needed — this prevents partial-state signups
      // and privilege escalation via direct role inserts.
      const metadata: Record<string, string> = {
        full_name: fullName,
        role: userRole,
      };

      if (userRole === 'student') {
        if (additionalData?.collegeId) metadata.college_id = additionalData.collegeId;
        if (additionalData?.bchWallet) metadata.bch_wallet_address = additionalData.bchWallet;
      } else if (userRole === 'vendor') {
        if (additionalData?.shopName) metadata.shop_name = additionalData.shopName;
        if (additionalData?.vendorType) metadata.vendor_type = additionalData.vendorType;
        if (additionalData?.bchAddress) metadata.bch_address = additionalData.bchAddress;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Signup failed');

      setRole(userRole);
      return { error: null };
    } catch (error) {
      logger.error('Signup error', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Unable to create account. Please try again.';
      return { error: new Error(message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      logger.error('Sign-in error', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Unable to sign in. Please check your credentials.';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
