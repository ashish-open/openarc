import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from '@/components/kyc/DateRangePicker';
import StatsCard from '@/components/dashboard/StatsCard';

// Define the period type
type PeriodType = 'daily' | 'monthly';

// Mock data for KYC metrics
const monthlyTrendsData = [
  { month: 'Jan', completed: 45, pending: 12, rejected: 3, domain: { pg: 30, payout: 20, api: 10 } },
  { month: 'Feb', completed: 52, pending: 15, rejected: 4, domain: { pg: 35, payout: 25, api: 11 } },
  { month: 'Mar', completed: 49, pending: 10, rejected: 2, domain: { pg: 28, payout: 22, api: 11 } },
  { month: 'Apr', completed: 63, pending: 8, rejected: 5, domain: { pg: 40, payout: 24, api: 12 } },
  { month: 'May', completed: 55, pending: 14, rejected: 3, domain: { pg: 38, payout: 21, api: 13 } },
  { month: 'Jun', completed: 70, pending: 11, rejected: 2, domain: { pg: 45, payout: 26, api: 12 } },
];

const statusData = [
  { name: 'Completed', value: 334 },
  { name: 'Pending', value: 70 },
  { name: 'Rejected', value: 19 },
];

const domainData = [
  { name: 'Payment Gateway', completed: 186, pending: 35, rejected: 10 },
  { name: 'Payout', completed: 98, pending: 25, rejected: 6 },
  { name: 'APIs', completed: 50, pending: 10, rejected: 3 },
];

const COLORS = ['#663399', '#8884d8', '#ff7d7d', '#82ca9d', '#8dd1e1'];
const STATUS_COLORS = ['#4ade80', '#facc15', '#ef4444'];
const DOMAIN_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

const KycDashboard: React.FC = () => {
  useRequireAuth('viewer');
  
  // Date range state for filtering
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Tab state for switching between daily/monthly views
  const [activeTab, setActiveTab] = useState<PeriodType>('daily');

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header with Date Range Picker */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">KYC Analytics</h1>
          <p className="text-muted-foreground mt-1">Monitor and analyze KYC performance metrics</p>
        </div>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Onboardings"
          value="423"
          icon={<Users className="h-5 w-5 text-blue-500" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Verified Users"
          value="334"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Verification"
          value="70"
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title="Rejected Applications"
          value="19"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Performance Metrics */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Onboarding Performance</h2>
            <Tabs value={activeTab} onValueChange={(value: PeriodType) => setActiveTab(value)} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#663399" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="pending" stroke="#8884d8" />
                <Line type="monotone" dataKey="rejected" stroke="#ff7d7d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KYC Status & Document Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">KYC Status Distribution</h2>
            <p className="text-base text-muted-foreground">Current period</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-base text-muted-foreground">KYC status by product domain</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={domainData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill={STATUS_COLORS[0]} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill={STATUS_COLORS[1]} />
                  <Bar dataKey="rejected" name="Rejected" stackId="a" fill={STATUS_COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KycDashboard;
