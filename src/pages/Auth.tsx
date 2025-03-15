
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Github, Mail } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
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
      role: value
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Đăng ký người dùng mới
        console.log('Attempting to sign up with:', { email: formData.email, role: formData.role, fullName: formData.fullName });
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: formData.role
            }
          }
        });
        
        if (signUpError) {
          console.error('Sign-up error:', signUpError);
          throw signUpError;
        }
        
        console.log('Sign-up successful:', signUpData);
        
        // Nếu đăng ký thành công, cập nhật hồ sơ người dùng với vai trò
        if (signUpData.user) {
          console.log('Updating profile for user:', signUpData.user.id);
          
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: signUpData.user.id,
              role: formData.role,
              full_name: formData.fullName 
            });
            
          if (profileError) {
            console.error('Profile update error:', profileError);
            toast.error('Đã đăng ký nhưng không thể cập nhật hồ sơ: ' + profileError.message);
          } else {
            console.log('Profile updated successfully');
          }
        }
        
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsSignUp(false);
      } else {
        // Đăng nhập
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
        navigate('/dashboard');
        toast.success('Đăng nhập thành công!');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Đã xảy ra lỗi trong quá trình xác thực');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
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
      toast.error(error.message || `Đăng nhập bằng ${provider} không thành công`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h2>
          <p className="text-muted-foreground mt-2">Hệ thống quản lý hoạt động ngoại khóa</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required={isSignUp}
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={handleRoleChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Học sinh</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Giáo viên</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            <Mail className="mr-2" />
            {isLoading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký với Email' : 'Đăng nhập với Email')}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted-foreground">Hoặc tiếp tục với</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('github')}
          >
            <Github className="mr-2" />
            Github
          </Button>
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
