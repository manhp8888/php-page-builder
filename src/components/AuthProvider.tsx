
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  signOut: () => Promise<void>;
  userName: string | null;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  userRole: null,
  userName: null,
  signOut: async () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return { role: null, fullName: null };
      }
      
      console.log('User profile data:', data);
      return { 
        role: data?.role || null,
        fullName: data?.full_name || null
      };
    } catch (err) {
      console.error('Unknown error fetching user profile:', err);
      return { role: null, fullName: null };
    }
  };

  useEffect(() => {
    console.log('AuthProvider initialized');
    
    // Check current session
    const checkSession = async () => {
      try {
        console.log('Checking current session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          console.log('Current user found, fetching profile');
          try {
            const { role, fullName } = await fetchUserProfile(currentUser.id);
            console.log('User profile from getSession:', { role, fullName });
            setUserRole(role);
            setUserName(fullName);
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        } else {
          console.log('No active session found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session ? 'exists' : 'null');
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const { role, fullName } = await fetchUserProfile(currentUser.id);
          console.log('User profile from onAuthStateChange:', { role, fullName });
          setUserRole(role);
          setUserName(fullName);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserRole(null);
        setUserName(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out');
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Đã đăng xuất thành công');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Đăng xuất không thành công');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole, userName, signOut }}>
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
