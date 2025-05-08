
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock data for Risk metrics
const riskTrendsData = [
  { month: 'Jan', lowRisk: 120, mediumRisk: 45, highRisk: 15 },
  { month: 'Feb', lowRisk: 132, mediumRisk: 48, highRisk: 18 },
  { month: 'Mar', lowRisk: 141, mediumRisk: 42, highRisk: 12 },
  { month: 'Apr', lowRisk: 158, mediumRisk: 55, highRisk: 22 },
  { month: 'May', lowRisk: 162, mediumRisk: 58, highRisk: 19 },
  { month: 'Jun', lowRisk: 170, mediumRisk: 60, highRisk: 14 },
];

const riskDistributionData = [
  { name: 'Low Risk', value: 170 },
  { name: 'Medium Risk', value: 60 },
  { name: 'High Risk', value: 14 },
];

const alertTypesData = [
  { name: 'Unusual Location', count: 28 },
  { name: 'Large Transaction', count: 22 },
  { name: 'Multiple Accounts', count: 18 },
  { name: 'Suspicious Activity', count: 15 },
  { name: 'Failed Verification', count: 12 },
];

const recentAlerts = [
  { id: 'A1283', user: 'john.doe@example.com', type: 'Large Transaction', risk: 'high', time: '10 mins ago' },
  { id: 'A1282', user: 'sarah.smith@example.com', type: 'Unusual Location', risk: 'medium', time: '25 mins ago' },
  { id: 'A1281', user: 'michael.brown@example.com', type: 'Multiple Accounts', risk: 'medium', time: '45 mins ago' },
  { id: 'A1280', user: 'emma.wilson@example.com', type: 'Failed Verification', risk: 'high', time: '1 hour ago' },
  { id: 'A1279', user: 'james.taylor@example.com', type: 'Suspicious Activity', risk: 'high', time: '2 hours ago' },
];

const COLORS = ['#4ade80', '#facc15', '#ef4444'];

const RiskDashboard: React.FC = () => {
  useRequireAuth('viewer');

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Risk Monitoring Dashboard</h1>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Total Alerts</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95</div>
            <p className="text-sm text-destructive">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">High Risk Alerts</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-sm text-destructive">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Alert Resolution Time</CardTitle>
            <CardDescription>Average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6.2 hrs</div>
            <p className="text-sm text-green-600">-0.8 hrs from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Flagged Users</CardTitle>
            <CardDescription>Current count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">38</div>
            <p className="text-sm text-destructive">+5 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Risk Alerts</CardTitle>
          <CardDescription>Latest alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-left">Alert ID</th>
                  <th className="pb-2 font-medium text-left">User</th>
                  <th className="pb-2 font-medium text-left">Alert Type</th>
                  <th className="pb-2 font-medium text-left">Risk Level</th>
                  <th className="pb-2 font-medium text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{alert.id}</td>
                    <td className="py-3">{alert.user}</td>
                    <td className="py-3">{alert.type}</td>
                    <td className="py-3">{getRiskBadge(alert.risk)}</td>
                    <td className="py-3 text-gray-500">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
          <TabsTrigger value="types">Alert Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Trends</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={riskTrendsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="lowRisk" stroke="#4ade80" strokeWidth={2} />
                    <Line type="monotone" dataKey="mediumRisk" stroke="#facc15" strokeWidth={2} />
                    <Line type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Risk Distribution</CardTitle>
              <CardDescription>All active users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        
        <TabsContent value="types" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Type Distribution</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={alertTypesData}
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

export default RiskDashboard;
