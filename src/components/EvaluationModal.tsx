
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface EvaluationModalProps {
  activityId: string;
  activityTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityId: string, rating: number, comment: string) => void;
}

const EvaluationModal = ({
  activityId,
  activityTitle,
  isOpen,
  onClose,
  onSave
}: EvaluationModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSave = () => {
    onSave(activityId, rating, comment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đánh giá hoạt động: {activityTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoverRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Nhận xét của bạn
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về hoạt động này"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={rating === 0}
            className="bg-system-green hover:bg-system-greenHover"
          >
            Gửi đánh giá
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationModal;
