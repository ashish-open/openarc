
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for KYC metrics
const monthlyTrendsData = [
  { month: 'Jan', completed: 45, pending: 12, rejected: 3 },
  { month: 'Feb', completed: 52, pending: 15, rejected: 4 },
  { month: 'Mar', completed: 49, pending: 10, rejected: 2 },
  { month: 'Apr', completed: 63, pending: 8, rejected: 5 },
  { month: 'May', completed: 55, pending: 14, rejected: 3 },
  { month: 'Jun', completed: 70, pending: 11, rejected: 2 },
];

const statusData = [
  { name: 'Completed', value: 334 },
  { name: 'Pending', value: 70 },
  { name: 'Rejected', value: 19 },
];

const documentTypeData = [
  { name: 'Passport', count: 152 },
  { name: 'ID Card', count: 120 },
  { name: 'Driver License', count: 100 },
  { name: 'Residence Permit', count: 45 },
  { name: 'Other', count: 6 },
];

const COLORS = ['#663399', '#8884d8', '#ff7d7d', '#82ca9d', '#8dd1e1'];
const STATUS_COLORS = ['#4ade80', '#facc15', '#ef4444'];

const KycDashboard: React.FC = () => {
  useRequireAuth('viewer');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">KYC Onboarding Dashboard</h1>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">KYC Completion Rate</CardTitle>
            <CardDescription>Overall</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87.2%</div>
            <p className="text-sm text-green-600">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Average Completion Time</CardTitle>
            <CardDescription>From start to finish</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.4 days</div>
            <p className="text-sm text-green-600">-0.3 days from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Drop-off Rate</CardTitle>
            <CardDescription>Started but not completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.5%</div>
            <p className="text-sm text-destructive">+0.8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">New KYC Requests</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">423</div>
            <p className="text-sm text-green-600">+5% from previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="status">KYC Status</TabsTrigger>
          <TabsTrigger value="documents">Document Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Onboarding Monthly Trends</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrendsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
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
        </TabsContent>
        
        <TabsContent value="status" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current KYC Status Distribution</CardTitle>
              <CardDescription>All users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
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
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Type Distribution</CardTitle>
              <CardDescription>Types of documents submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={documentTypeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#663399" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KycDashboard;
