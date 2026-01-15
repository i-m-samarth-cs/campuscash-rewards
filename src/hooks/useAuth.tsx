import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type UserRole = 'student' | 'vendor' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  signUp: (email: string, password: string, fullName: string, role: 'student' | 'vendor', additionalData?: Record<string, string>) => Promise<{ error: Error | null }>;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
      }
    );

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
      console.error('Error fetching user role:', error);
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
      
      // Role is passed via user metadata and assigned by database trigger
      // This prevents client-side role manipulation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: userRole,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Signup failed');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          full_name: fullName,
          email,
          college_id: additionalData?.collegeId || null,
          bch_wallet_address: additionalData?.bchWallet || null,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Role is now assigned automatically by database trigger on auth.users insert
      // No client-side role insertion needed - prevents privilege escalation

      // If vendor, create vendor record
      if (userRole === 'vendor' && additionalData) {
        const { error: vendorError } = await supabase
          .from('vendors')
          .insert({
            user_id: data.user.id,
            shop_name: additionalData.shopName || 'My Shop',
            vendor_type: additionalData.vendorType || 'canteen',
            bch_address: additionalData.bchAddress || '',
          });

        if (vendorError) {
          console.error('Vendor creation error:', vendorError);
        }
      }

      setRole(userRole);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
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
      return { error: error as Error };
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
