import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, AlertCircle, LineChart, Ticket } from 'lucide-react';
import { LineChart as ReChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts and analytics
const kycData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 49 },
  { name: 'Apr', value: 62 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 78 }
];

const riskData = [
  { name: 'Jan', value: 15 },
  { name: 'Feb', value: 22 },
  { name: 'Mar', value: 19 },
  { name: 'Apr', value: 32 },
  { name: 'May', value: 25 },
  { name: 'Jun', value: 18 }
];

// Widget interface to define overview sections
interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  type: 'chart' | 'stats' | 'list';
  visible: boolean;
  component: React.ReactNode;
  navLink?: string;
  permissions: ('super-admin' | 'admin' | 'viewer')[];
}

const Overview: React.FC = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const { user } = useRequireAuth();

  // Define the available dashboard widgets
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'kyc-overview',
      title: 'KYC Overview',
      description: 'Recent onboarding statistics',
      type: 'chart',
      visible: true,
      permissions: ['super-admin', 'admin', 'viewer'],
      component: (
        <div className="h-80 flex flex-col justify-between">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ReChart data={kycData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </ReChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center w-full">
            <p className="text-sm">Total: <span className="font-bold">341</span> verifications</p>
            <Button variant="outline" onClick={() => navigate('/kyc')} className="flex items-center gap-2">
              View Details <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
      navLink: '/dashboard/kyc'
    },
    {
      id: 'risk-alerts',
      title: 'Risk Alerts',
      description: 'High priority alerts requiring attention',
      type: 'list',
      visible: true,
      permissions: ['super-admin', 'admin', 'viewer'],
      component: (
        <div className="space-y-4">
          <div className="border p-3 rounded-md bg-yellow-50 border-yellow-100 flex justify-between">
            <div>
              <p className="font-medium">Multiple failed login attempts</p>
              <p className="text-sm text-gray-500">User ID: U10004</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/users/U10004')}
            >
              View
            </Button>
          </div>
          <div className="border p-3 rounded-md bg-red-50 border-red-100 flex justify-between">
            <div>
              <p className="font-medium">Large suspicious transaction</p>
              <p className="text-sm text-gray-500">Transaction ID: T2002</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/risk')}
            >
              View
            </Button>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/risk')} className="flex items-center gap-2 w-full">
            View All Risk Alerts <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ),
      navLink: '/dashboard/risk'
    },
    {
      id: 'recent-tickets',
      title: 'Recent Tickets',
      description: 'Open support tickets',
      type: 'stats',
      visible: true,
      permissions: ['super-admin', 'admin'],
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/tickets')} className="flex items-center gap-2 w-full">
            View All Tickets <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ),
      navLink: '/dashboard/tickets'
    },
    {
      id: 'user-activity',
      title: 'Active Users',
      description: 'User activity in the last 7 days',
      type: 'chart',
      visible: true,
      permissions: ['super-admin', 'admin'],
      component: (
        <div className="h-80 flex flex-col justify-between">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ReChart data={riskData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </ReChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center w-full">
            <p className="text-sm">Total Active: <span className="font-bold">133</span> users</p>
            <Button variant="outline" onClick={() => navigate('/dashboard/users')} className="flex items-center gap-2">
              View Users <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
      navLink: '/dashboard/users'
    }
  ]);
  
  // Filter widgets based on user role
  const visibleWidgets = widgets.filter(widget => 
    widget.visible && 
    widget.permissions.includes(user?.role || 'viewer')
  );

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">OpenArc Overview</h1>
        {user?.role === 'super-admin' && (
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Save Layout' : 'Customize Dashboard'}
          </Button>
        )}
      </div>

      {editMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Settings</CardTitle>
            <CardDescription>Configure which widgets appear on the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <p className="font-medium">{widget.title}</p>
                    <p className="text-sm text-gray-500">{widget.description}</p>
                    <p className="text-xs text-gray-400">Visible to: {widget.permissions.join(', ')}</p>
                  </div>
                  <Button 
                    variant={widget.visible ? "default" : "outline"} 
                    onClick={() => toggleWidgetVisibility(widget.id)}
                  >
                    {widget.visible ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleWidgets.map(widget => (
            <Card key={widget.id}>
              <CardHeader>
                <h2 className="text-xl font-semibold">{widget.title}</h2>
                <p className="text-base text-muted-foreground">{widget.description}</p>
              </CardHeader>
              <CardContent>
                {widget.component}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending KYC
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Risk Users
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              -2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaction Volume
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$482,219</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Tickets
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              -4% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
