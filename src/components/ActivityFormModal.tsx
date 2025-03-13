
import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
}

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id'> & { id?: string }) => void;
  activity?: Activity;
  mode: 'add' | 'edit';
}

const ActivityFormModal = ({
  isOpen,
  onClose,
  onSave,
  activity,
  mode
}: ActivityFormModalProps) => {
  const [formData, setFormData] = useState<Omit<Activity, 'id'> & { id?: string }>({
    title: '',
    date: '',
    location: '',
    participants: 0
  });

  useEffect(() => {
    if (activity && mode === 'edit') {
      setFormData(activity);
    } else {
      setFormData({
        title: '',
        date: '',
        location: '',
        participants: 0
      });
    }
  }, [activity, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm hoạt động mới' : 'Chỉnh sửa hoạt động'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tên hoạt động</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tên hoạt động"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Ngày diễn ra</span>
            </Label>
            <Input
              id="date"
              name="date"
              type="text"
              value={formData.date}
              onChange={handleChange}
              placeholder="Ví dụ: 15/05/2025"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Địa điểm</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Nhập địa điểm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participants" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Số học sinh tham gia</span>
            </Label>
            <Input
              id="participants"
              name="participants"
              type="number"
              min="0"
              value={formData.participants.toString()}
              onChange={handleChange}
              placeholder="Nhập số lượng"
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-system-green hover:bg-system-greenHover">
              {mode === 'add' ? 'Thêm mới' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormModal;
