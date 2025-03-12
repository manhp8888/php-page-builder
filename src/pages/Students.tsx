
import { useState } from 'react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import { Users, Star, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  activities: {
    name: string;
    score: number;
  }[];
}

const Students = () => {
  const [userName] = useState('Nguyễn Văn A');
  const [searchQuery, setSearchQuery] = useState('');
  
  const students: Student[] = [
    {
      id: 'HS001',
      name: 'Nguyễn Văn A',
      activities: [
        { name: 'Thi đấu bóng đá', score: 8 },
        { name: 'Dã ngoại', score: 7 }
      ]
    },
    {
      id: 'HS002',
      name: 'Trần Thị B',
      activities: [
        { name: 'Thi đấu bóng đá', score: 7 },
        { name: 'Dã ngoại', score: 9 }
      ]
    },
    {
      id: 'HS003',
      name: 'Lê Văn C',
      activities: [
        { name: 'Thi đấu bóng đá', score: 6 },
        { name: 'Dã ngoại', score: 8 }
      ]
    }
  ];
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const calculateAverageScore = (student: Student) => {
    if (student.activities.length === 0) return 0;
    const total = student.activities.reduce((sum, activity) => sum + activity.score, 0);
    return (total / student.activities.length).toFixed(1);
  };
  
  const handleAddStudent = () => {
    toast('Tính năng đang phát triển');
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <UserHeader userName={userName} />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Học sinh</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            
            <button onClick={handleAddStudent} className="btn-success flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-border card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-system-blue text-white">
                <th className="text-left p-4 font-medium">Mã học sinh</th>
                <th className="text-left p-4 font-medium">Tên học sinh</th>
                <th className="text-left p-4 font-medium">Số hoạt động</th>
                <th className="text-left p-4 font-medium">Điểm trung bình</th>
                <th className="text-left p-4 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-border hover:bg-muted/20">
                    <td className="p-4">{student.id}</td>
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4">{student.activities.length}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-system-orange fill-system-orange" />
                        <span>{calculateAverageScore(student)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button className="text-system-blue hover:text-system-blueHover underline text-sm">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Không tìm thấy học sinh nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
