
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface SocialLoginButtonsProps {
  isLoading: boolean;
  handleSocialLogin: (provider: 'github' | 'google') => void;
}

const SocialLoginButtons = ({ isLoading, handleSocialLogin }: SocialLoginButtonsProps) => {
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleSocialLogin('github')}
        disabled={isLoading}
      >
        <Github className="mr-2" />
        Github
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
