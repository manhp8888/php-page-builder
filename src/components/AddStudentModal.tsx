
import { useState } from 'react';
import { X, Save, User, IdCard, Star, BookOpen } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: {
    id: string;
    name: string;
    activities: { name: string; score: number }[];
  }) => void;
}

const AddStudentModal = ({ isOpen, onClose, onAddStudent }: AddStudentModalProps) => {
  const [studentData, setStudentData] = useState({
    id: '',
    name: '',
    class: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tạo ID tự động nếu không nhập
    const studentId = studentData.id || `HS${Math.floor(1000 + Math.random() * 9000)}`;
    
    onAddStudent({
      id: studentId,
      name: studentData.name,
      activities: [] // Học sinh mới chưa có hoạt động nào
    });
    
    // Reset form
    setStudentData({
      id: '',
      name: '',
      class: '',
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-md p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Thêm học sinh mới</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="id" className="block text-sm font-medium">
                Mã học sinh (tùy chọn)
              </label>
              <div className="relative">
                <IdCard className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  id="id"
                  name="id"
                  type="text"
                  value={studentData.id}
                  onChange={handleInputChange}
                  placeholder="Để trống để tạo mã tự động"
                  className="input-field pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Họ và tên <span className="text-system-red">*</span>
              </label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={studentData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="class" className="block text-sm font-medium">
                Lớp
              </label>
              <div className="relative">
                <BookOpen className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  id="class"
                  name="class"
                  type="text"
                  value={studentData.class}
                  onChange={handleInputChange}
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn-success flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Lưu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
