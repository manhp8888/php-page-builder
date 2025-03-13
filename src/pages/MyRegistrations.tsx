
import { useState, useEffect } from 'react';
import { ClipboardList, AlertCircle } from 'lucide-react';
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Registration {
  id: string;
  activity_id: string;
  status: string;
  registration_date: string;
  activity: {
    title: string;
    date: string;
    location: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

const MyRegistrations = () => {
  const [userName, setUserName] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user profile to get name
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        if (data && !error) {
          setUserName(data.full_name || user.email || '');
        }
      };
      
      fetchProfile();
    }
  }, [user]);

  // Query to fetch student registrations with activity details
  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['myRegistrations', 'details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_registrations')
        .select(`
          id, 
          activity_id, 
          status, 
          registration_date,
          activity:activities(title, date, location)
        `)
        .eq('student_id', user!.id)
        .order('registration_date', { ascending: false });
        
      if (error) {
        toast.error('Không thể tải đăng ký: ' + error.message);
        return [];
      }
      
      return data as Registration[];
    },
    enabled: !!user
  });

  // Mutation to cancel registration
  const cancelRegistrationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('student_registrations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast.success('Đã hủy đăng ký thành công');
    },
    onError: (error) => {
      console.error('Error canceling registration:', error);
      toast.error('Không thể hủy đăng ký');
    }
  });

  const handleCancelRegistration = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký này không?')) {
      cancelRegistrationMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <UserHeader userName={userName} />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Đăng ký của tôi</h1>
        </div>
        
        {isLoading ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Đang tải đăng ký...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg bg-background">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Bạn chưa đăng ký hoạt động nào.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/activities'}
            >
              Xem danh sách hoạt động
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hoạt động
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ngày diễn ra
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-muted/10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{registration.activity?.title || 'Không rõ'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.activity?.date || 'Không rõ'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.activity?.location || 'Không rõ'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(registration.status)}`}>
                        {registration.status === 'pending' && 'Chờ duyệt'}
                        {registration.status === 'approved' && 'Đã duyệt'}
                        {registration.status === 'rejected' && 'Từ chối'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(registration.registration_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {registration.status === 'pending' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelRegistration(registration.id)}
                        >
                          Hủy
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
