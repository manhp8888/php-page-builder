
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from "date-fns";
import SideNav from '@/components/SideNav';
import UserHeader from '@/components/UserHeader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportChart } from '@/components/ReportChart';

const Reports = () => {
  const [userName] = useState('Nguyễn Văn A');
  const [reportType, setReportType] = useState<'period' | 'year'>('period');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2024');

  const periods = [
    { value: '1', label: 'Học kỳ 1' },
    { value: '2', label: 'Học kỳ 2' },
  ];

  const years = ['2024', '2023', '2022'];

  const mockData = [
    { name: 'Thể thao', value: 45 },
    { name: 'Văn hóa', value: 30 },
    { name: 'Học thuật', value: 25 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      
      <div className="flex-1 ml-64 p-8">
        <UserHeader userName={userName} />
        
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">Báo cáo hoạt động</h1>
          
          <div className="flex gap-4 mb-6">
            <Button
              variant={reportType === 'period' ? 'default' : 'outline'}
              onClick={() => setReportType('period')}
            >
              Theo học kỳ
            </Button>
            <Button
              variant={reportType === 'year' ? 'default' : 'outline'}
              onClick={() => setReportType('year')}
            >
              Theo năm học
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            {reportType === 'period' ? (
              <>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        Năm {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      Năm {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số hoạt động
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 so với kỳ trước
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Số học sinh tham gia
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">250</div>
              <p className="text-xs text-muted-foreground">
                +20 so với kỳ trước
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tỷ lệ tham gia
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">
                +5% so với kỳ trước
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Phân bố hoạt động theo loại</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ReportChart data={mockData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
