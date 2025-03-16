
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuthFormData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'teacher';
}

export function useAuthForm(isSignUp: boolean) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    fullName: '',
    role: 'student'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as 'student' | 'teacher'
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Login only
      console.log('Attempting to sign in with:', { email: formData.email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) {
        console.error('Sign-in error:', error);
        throw error;
      }
      
      console.log('Sign-in successful:', data);
      
      // Fetch user profile to verify role
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user role after login:', profileError);
        } else {
          console.log('User role from login:', profileData.role);
        }
      }
      
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Đã xảy ra lỗi trong quá trình xác thực');
      toast.error(error.message || 'Đã xảy ra lỗi trong quá trình xác thực');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setError(null);
      console.log(`Attempting to sign in with ${provider}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error(`${provider} sign-in error:`, error);
        throw error;
      }
      
      console.log(`${provider} sign-in initiated:`, data);
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      setError(error.message || `Đăng nhập bằng ${provider} không thành công`);
      toast.error(error.message || `Đăng nhập bằng ${provider} không thành công`);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleRoleChange,
    handleEmailAuth,
    handleSocialLogin,
    setError
  };
}
