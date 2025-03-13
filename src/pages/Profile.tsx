
import { useState, useEffect } from 'react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import { toast } from 'sonner';
import { User, Mail, Phone, School, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

const Profile = () => {
  const { user, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Lấy dữ liệu từ bảng profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Lỗi khi lấy thông tin hồ sơ:', error);
          toast.error('Không thể tải thông tin hồ sơ');
          return;
        }
        
        // Cập nhật state với dữ liệu từ cơ sở dữ liệu
        setUserData({
          name: data.full_name || '',
          email: user.email || '',
          phone: data.phone || '',
          school: data.school || '',
          role: data.role === 'teacher' ? 'Giáo viên' : 'Học sinh'
        });
      } catch (error) {
        console.error('Lỗi:', error);
        toast.error('Đã xảy ra lỗi khi tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.name,
          phone: userData.phone,
          school: userData.school
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        toast.error('Không thể cập nhật thông tin');
        return;
      }
      
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <SideNav />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-system-blue mx-auto"></div>
            <p className="mt-3 text-muted-foreground">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <UserHeader userName={userData.name} userRole={userData.role} />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
          
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`${isEditing ? 'btn-success' : 'btn-primary'} flex items-center gap-1.5`}
          >
            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-border card-shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className="input-field pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="school" className="block text-sm font-medium">
                  Trường
                </label>
                <div className="relative">
                  <School className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="school"
                    name="school"
                    type="text"
                    value={userData.school}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field pl-9"
                  />
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button type="submit" className="btn-success flex items-center gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
