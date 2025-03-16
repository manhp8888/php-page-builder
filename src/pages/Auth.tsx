
import { useState } from 'react';
import { useAuthForm } from '@/hooks/useAuthForm';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleRoleChange,
    handleEmailAuth,
    handleSocialLogin,
    setError
  } = useAuthForm(isSignUp);

  const handleSubmit = async (e: React.FormEvent) => {
    const success = await handleEmailAuth(e);
    
    // If signup was successful, switch to login view
    if (isSignUp && success) {
      setIsSignUp(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h2>
          <p className="text-muted-foreground mt-2">Hệ thống quản lý hoạt động ngoại khóa</p>
        </div>

        {isSignUp ? (
          <SignupForm
            formData={formData}
            isLoading={isLoading}
            error={error}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            handleSubmit={handleSubmit}
          />
        ) : (
          <LoginForm
            formData={formData}
            isLoading={isLoading}
            error={error}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted-foreground">Hoặc tiếp tục với</span>
          </div>
        </div>

        <SocialLoginButtons 
          isLoading={isLoading}
          handleSocialLogin={handleSocialLogin}
        />

        <div className="text-center mt-6">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={toggleAuthMode}
          >
            {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
