
import { useAuthForm } from '@/hooks/useAuthForm';
import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const Auth = () => {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleEmailAuth,
    handleSocialLogin,
  } = useAuthForm(false); // Always false since we're only doing login now

  const handleSubmit = async (e: React.FormEvent) => {
    await handleEmailAuth(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Đăng nhập</h2>
          <p className="text-muted-foreground mt-2">Hệ thống quản lý hoạt động ngoại khóa</p>
        </div>

        <LoginForm
          formData={formData}
          isLoading={isLoading}
          error={error}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />

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
      </div>
    </div>
  );
};

export default Auth;
