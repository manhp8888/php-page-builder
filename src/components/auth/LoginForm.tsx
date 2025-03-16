
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail } from 'lucide-react';
import { AuthFormData } from '@/hooks/useAuthForm';

interface LoginFormProps {
  formData: AuthFormData;
  isLoading: boolean;
  error: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  formData,
  isLoading,
  error,
  handleInputChange,
  handleSubmit
}: LoginFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        <Mail className="mr-2" />
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </Button>
    </form>
  );
};

export default LoginForm;
