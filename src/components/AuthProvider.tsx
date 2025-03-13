
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
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  userRole: null,
  signOut: async () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return null;
      }
      
      console.log('Dữ liệu hồ sơ người dùng:', data);
      return data?.role;
    } catch (err) {
      console.error('Lỗi không xác định khi lấy vai trò người dùng:', err);
      return null;
    }
  };

  useEffect(() => {
    // Kiểm tra phiên hiện tại
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const role = await fetchUserRole(currentUser.id);
          console.log('Vai trò người dùng từ getSession:', role);
          setUserRole(role);
        } catch (err) {
          console.error('Lỗi khi lấy vai trò người dùng:', err);
        }
      }
      
      setLoading(false);
    });

    // Lắng nghe sự thay đổi trạng thái xác thực
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const role = await fetchUserRole(currentUser.id);
          console.log('Vai trò người dùng từ onAuthStateChange:', role);
          setUserRole(role);
        } catch (err) {
          console.error('Lỗi khi lấy vai trò người dùng:', err);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Đã đăng xuất thành công');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      toast.error('Đăng xuất không thành công');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole, signOut }}>
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
