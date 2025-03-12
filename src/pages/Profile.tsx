
import { useState } from 'react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import { toast } from 'sonner';
import { User, Mail, Phone, School, Save } from 'lucide-react';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@edu.vn',
    phone: '0912345678',
    school: 'Trường THPT Việt Nam',
    role: 'Giáo viên'
  });

  const [isEditing, setIsEditing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập cập nhật thành công
    setTimeout(() => {
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    }, 500);
  };

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
                    disabled={!isEditing}
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
