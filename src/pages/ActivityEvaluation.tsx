
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, Calendar, MapPin } from 'lucide-react';
import SideNav from '@/components/SideNav';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  score: number;
  feedback: string;
}

const ActivityEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Giả lập dữ liệu hoạt động
  const [activity] = useState({
    id: id || '1',
    title: 'Thi đấu bóng đá',
    date: '15/02/2025',
    location: 'Sân bóng trường'
  });
  
  // Giả lập dữ liệu học sinh
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'HS001',
      name: 'Nguyễn Văn A',
      score: 8,
      feedback: 'Chơi tích cực'
    },
    {
      id: 'HS002',
      name: 'Trần Thị B',
      score: 7,
      feedback: 'Cần cải thiện thể lực'
    }
  ]);
  
  const handleScoreChange = (id: string, score: number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, score } : student
    ));
  };
  
  const handleFeedbackChange = (id: string, feedback: string) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, feedback } : student
    ));
  };
  
  const handleSave = () => {
    toast.success('Đã lưu đánh giá hoạt động');
    navigate('/activities');
  };
  
  const handleCancel = () => {
    navigate('/activities');
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-2">Đánh giá hoạt động: {activity.title}</h1>
        
        <div className="flex items-center gap-6 mb-6 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{activity.location}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-border card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-system-blue text-white">
                <th className="text-left p-4 font-medium">Tên học sinh</th>
                <th className="text-left p-4 font-medium">Mã học sinh</th>
                <th className="text-left p-4 font-medium">Điểm (0-10)</th>
                <th className="text-left p-4 font-medium">Nhận xét</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-border">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.id}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={student.score}
                      onChange={(e) => handleScoreChange(student.id, Number(e.target.value))}
                      className="input-field w-20"
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      value={student.feedback}
                      onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                      className="input-field h-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={handleCancel} className="btn-danger flex items-center gap-1.5">
            <X className="h-4 w-4" />
            <span>Hủy</span>
          </button>
          <button onClick={handleSave} className="btn-success flex items-center gap-1.5">
            <Check className="h-4 w-4" />
            <span>Lưu tất cả</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityEvaluation;
