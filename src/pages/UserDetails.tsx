import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Document {
  type: string;
  status: string;
  uploadedAt: string;
  rejectionReason?: string; // Make rejectionReason optional
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}

interface Alert {
  id: string;
  type: string;
  date: string;
  status: string;
}

interface RiskDataPoint {
  date: string;
  score: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: string;
  riskLevel: string;
  createdAt: string;
  lastActivity: string;
  country: string;
  documents: Document[];
  transactions: Transaction[];
  riskData: RiskDataPoint[];
  alerts: Alert[];
}

// Mock user data
const mockUsers: Record<string, UserData> = {
  'U10001': {
    id: 'U10001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    kycStatus: 'verified',
    riskLevel: 'low',
    createdAt: '2023-01-15',
    lastActivity: '2023-06-01',
    country: 'United States',
    documents: [
      { type: 'Passport', status: 'verified', uploadedAt: '2023-01-15' },
      { type: 'Address Proof', status: 'verified', uploadedAt: '2023-01-15' },
    ],
    transactions: [
      { id: 'T1001', amount: 500, type: 'deposit', status: 'completed', date: '2023-05-15' },
      { id: 'T1002', amount: 200, type: 'withdrawal', status: 'completed', date: '2023-05-20' },
      { id: 'T1003', amount: 300, type: 'deposit', status: 'completed', date: '2023-05-25' },
    ],
    riskData: [
      { date: '2023-01', score: 20 },
      { date: '2023-02', score: 25 },
      { date: '2023-03', score: 22 },
      { date: '2023-04', score: 30 },
      { date: '2023-05', score: 28 },
      { date: '2023-06', score: 25 },
    ],
    alerts: [],
  },
  'U10004': {
    id: 'U10004',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '+61 555-987-6543',
    kycStatus: 'rejected',
    riskLevel: 'high',
    createdAt: '2023-02-10',
    lastActivity: '2023-06-03',
    country: 'Australia',
    documents: [
      { type: 'Driver License', status: 'rejected', uploadedAt: '2023-02-10', rejectionReason: 'Document expired' },
      { type: 'Address Proof', status: 'pending', uploadedAt: '2023-02-12' },
    ],
    transactions: [
      { id: 'T2001', amount: 1500, type: 'deposit', status: 'completed', date: '2023-05-18' },
      { id: 'T2002', amount: 1400, type: 'withdrawal', status: 'flagged', date: '2023-05-22' },
      { id: 'T2003', amount: 900, type: 'withdrawal', status: 'declined', date: '2023-05-28' },
    ],
    riskData: [
      { date: '2023-02', score: 40 },
      { date: '2023-03', score: 45 },
      { date: '2023-04', score: 60 },
      { date: '2023-05', score: 75 },
      { date: '2023-06', score: 85 },
    ],
    alerts: [
      { id: 'A001', type: 'Multiple Failed Login Attempts', date: '2023-05-20', status: 'resolved' },
      { id: 'A002', type: 'Unusual Location', date: '2023-05-22', status: 'open' },
      { id: 'A003', type: 'Large Transaction', date: '2023-05-28', status: 'open' },
    ],
  },
};

const UserDetails: React.FC = () => {
  useRequireAuth('viewer');
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const user = userId ? mockUsers[userId] : null;

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p>User not found.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/dashboard/users')}
            >
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {user.name}
                {getKycBadge(user.kycStatus)}
                {getRiskBadge(user.riskLevel)}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <div className="mt-2 md:mt-0">
              <Button variant="outline">
                Edit User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">User ID</h3>
              <p>{user.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p>{user.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Country</h3>
              <p>{user.country}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p>{user.createdAt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Activity</h3>
              <p>{user.lastActivity}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {user && user.documents.length > 0 ? (
                <div className="space-y-4">
                  {user.documents.map((doc, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{doc.type}</h3>
                          <p className="text-sm text-gray-500">Uploaded on: {doc.uploadedAt}</p>
                        </div>
                        <div>
                          {doc.status === 'verified' && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                          {doc.status === 'rejected' && <Badge className="bg-red-100 text-red-800">Rejected</Badge>}
                          {doc.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>}
                        </div>
                      </div>
                      {doc.rejectionReason && (
                        <div className="mt-2 text-sm text-red-600">
                          <p><strong>Rejection reason:</strong> {doc.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No KYC documents available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Risk score history (0-100)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={user.riskData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#663399" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Risk Factors</h3>
                <ul className="list-disc list-inside space-y-1">
                  {user.riskLevel === 'high' && (
                    <>
                      <li>Multiple login attempts from unusual locations</li>
                      <li>Large transactions flagged for review</li>
                      <li>Failed document verification</li>
                    </>
                  )}
                  {user.riskLevel === 'medium' && (
                    <>
                      <li>Some activity from unusual locations</li>
                      <li>Transaction patterns require monitoring</li>
                    </>
                  )}
                  {user.riskLevel === 'low' && (
                    <>
                      <li>Normal activity patterns</li>
                      <li>Fully verified identity</li>
                      <li>Consistent transaction behavior</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {user.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 font-medium text-left">ID</th>
                        <th className="pb-2 font-medium text-left">Amount</th>
                        <th className="pb-2 font-medium text-left">Type</th>
                        <th className="pb-2 font-medium text-left">Status</th>
                        <th className="pb-2 font-medium text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3">{tx.id}</td>
                          <td className="py-3">${tx.amount}</td>
                          <td className="py-3 capitalize">{tx.type}</td>
                          <td className="py-3">
                            {tx.status === 'completed' && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
                            {tx.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>}
                            {tx.status === 'flagged' && <Badge className="bg-orange-100 text-orange-800">Flagged</Badge>}
                            {tx.status === 'declined' && <Badge className="bg-red-100 text-red-800">Declined</Badge>}
                          </td>
                          <td className="py-3">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No transaction history available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {user.alerts && user.alerts.length > 0 ? (
                <div className="space-y-4">
                  {user.alerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-md flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{alert.type}</h3>
                        <p className="text-sm text-gray-500">Date: {alert.date}</p>
                      </div>
                      <div>
                        {alert.status === 'open' && <Badge className="bg-yellow-100 text-yellow-800">Open</Badge>}
                        {alert.status === 'resolved' && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No risk alerts for this user.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetails;
