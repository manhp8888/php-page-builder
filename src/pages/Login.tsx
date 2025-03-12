
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra đăng nhập (đơn giản, giả lập)
    if (username && password) {
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } else {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu');
    }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-muted-foreground">Chào mừng bạn đến với hệ thống</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="input-field"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full py-2.5"
          >
            Đăng nhập
          </button>
        </form>
        
        <div className="mt-5 text-center">
          <button className="text-sm text-system-blue hover:underline">
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
