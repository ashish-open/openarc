import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for dashboard metrics
const kycData = [
  { month: 'Jan', completed: 45, pending: 12, rejected: 3 },
  { month: 'Feb', completed: 52, pending: 15, rejected: 4 },
  { month: 'Mar', completed: 49, pending: 10, rejected: 2 },
  { month: 'Apr', completed: 63, pending: 8, rejected: 5 },
  { month: 'May', completed: 55, pending: 14, rejected: 3 },
  { month: 'Jun', completed: 70, pending: 11, rejected: 2 },
];

const riskData = [
  { month: 'Jan', lowRisk: 65, mediumRisk: 25, highRisk: 10 },
  { month: 'Feb', lowRisk: 60, mediumRisk: 28, highRisk: 12 },
  { month: 'Mar', lowRisk: 70, mediumRisk: 22, highRisk: 8 },
  { month: 'Apr', lowRisk: 55, mediumRisk: 30, highRisk: 15 },
  { month: 'May', lowRisk: 62, mediumRisk: 26, highRisk: 12 },
  { month: 'Jun', lowRisk: 75, mediumRisk: 20, highRisk: 5 },
];

const Dashboard: React.FC = () => {
  useRequireAuth('viewer');

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your platform's performance</p>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-base text-muted-foreground">Active accounts</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,284</div>
            <p className="text-sm text-green-600">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">KYC Completion</CardTitle>
            <CardDescription>Approval rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87.2%</div>
            <p className="text-sm text-green-600">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Risk Alerts</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-sm text-destructive">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Open Tickets</CardTitle>
            <CardDescription>Requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-gray-500">-3 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>KYC Onboarding Trends</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={kycData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#663399" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="pending" stroke="#8884d8" />
                  <Line type="monotone" dataKey="rejected" stroke="#ff7d7d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lowRisk" fill="#4ade80" />
                  <Bar dataKey="mediumRisk" fill="#facc15" />
                  <Bar dataKey="highRisk" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
