import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import UserForm from '@/components/UserForm';
import PGDetailsForm, { PGFormData } from '@/components/PGDetailsForm';

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
  onboardingStatus: 'verified' | 'blocked' | 'under_review';
  website: string;
  industry: string;
  mcc: string;
  businessModel: string;
  useCase: string;
  enabledServices: string[];
  pgProviders: string[];
  paymentMethodsEnabled: string[];
  riskTags: string[];
  fraudTransactionRatio: number;
  chargebackRatio: number;
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
    onboardingStatus: 'verified',
    website: 'www.johndoe-store.com',
    industry: 'E-commerce',
    mcc: '5399',
    businessModel: 'B2C Marketplace',
    useCase: 'Online retail store selling electronics and accessories',
    enabledServices: ['PG', 'Payout', 'API'],
    pgProviders: ['HDFC', 'Atom', 'TPSL'],
    paymentMethodsEnabled: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
    riskTags: ['high-value-transactions', 'international-customers'],
    fraudTransactionRatio: 0.001,
    chargebackRatio: 0.003,
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
    onboardingStatus: 'blocked',
    website: 'www.emmawilson-trading.com',
    industry: 'Cryptocurrency',
    mcc: '6051',
    businessModel: 'Crypto Exchange',
    useCase: 'Cryptocurrency trading platform with high-value transactions',
    enabledServices: ['PG'],
    pgProviders: ['HDFC'],
    paymentMethodsEnabled: ['Credit Card', 'UPI'],
    riskTags: ['high-risk-industry', 'multiple-chargebacks', 'suspicious-patterns'],
    fraudTransactionRatio: 0.015,
    chargebackRatio: 0.025,
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
  const [isEditing, setIsEditing] = useState(false);
  const [pgData, setPgData] = useState<null | { merchantId: string; businessName: string; status: string }>(null);
  const [showPgForm, setShowPgForm] = useState(false);
  const [pgForm, setPgForm] = useState({ merchantId: '', businessName: '', status: '' });
  const [newRiskTag, setNewRiskTag] = useState('');

  const user = userId ? mockUsers[userId] : null;

  const handleEditSubmit = (data: Partial<UserData>) => {
    // Here you would typically make an API call to update the user
    console.log('Updating user:', data);
    // For now, just update the mock data
    if (userId) {
      mockUsers[userId] = {
        ...mockUsers[userId],
        ...data,
      };
      setIsEditing(false);
    }
  };

  const handlePGSave = (data: PGFormData) => {
    setPgData({
      merchantId: data.merchantId,
      businessName: data.businessName,
      status: data.status,
    });
  };

  const handlePGSaveAndSend = (data: PGFormData) => {
    // First save the data
    handlePGSave(data);
    
    // Then create a Freshdesk ticket
    // This would typically be an API call to your backend
    console.log('Creating Freshdesk ticket for PG integration:', data);
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p>User not found.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/users')}
            >
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit User</h1>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <UserForm
          initialData={user}
          onSubmit={handleEditSubmit}
          isEditing={true}
        />
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

  const getOnboardingStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" />Blocked</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          Edit User
        </Button>
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

      {/* Business Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>Business information and enabled services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Onboarding Status</h3>
                {getOnboardingStatusBadge(user.onboardingStatus)}
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Website</h3>
                <p>{user.website}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Industry</h3>
                <p>{user.industry}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">MCC</h3>
                <p>{user.mcc}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Business Model</h3>
                <p>{user.businessModel}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Use Case</h3>
                <p className="text-sm text-gray-600">{user.useCase}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Risk Tags</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {user.riskTags.map((tag) => (
                    <Badge key={tag} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new risk tag"
                    value={newRiskTag}
                    onChange={(e) => setNewRiskTag(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (newRiskTag && !user.riskTags.includes(newRiskTag)) {
                        user.riskTags.push(newRiskTag);
                        setNewRiskTag('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Documents Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">KYC Documents</h2>
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

      {/* Integrations Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Integrations</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Enabled Services</h3>
              <div className="flex flex-wrap gap-2">
                {user.enabledServices.map((service) => (
                  <Badge key={service} variant="secondary">{service}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Gateway Providers</h3>
              <div className="flex flex-wrap gap-2">
                {user.pgProviders.map((provider) => (
                  <Badge key={provider} variant="outline">{provider}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Methods</h3>
              <div className="flex flex-wrap gap-2">
                {user.paymentMethodsEnabled.map((method) => (
                  <Badge key={method} variant="secondary">{method}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
          <CardDescription>Risk assessment and monitoring metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Fraud Transaction Ratio</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(user.fraudTransactionRatio * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{(user.fraudTransactionRatio * 100).toFixed(2)}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Chargeback Ratio</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(user.chargebackRatio * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{(user.chargebackRatio * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Risk Assessment Factors</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Industry Risk: {user.industry === 'Cryptocurrency' ? 'High' : 'Medium'}</li>
                  <li>Transaction Volume: {user.transactions.length > 10 ? 'High' : 'Low'}</li>
                  <li>Geographical Risk: {user.country === 'United States' ? 'Low' : 'Medium'}</li>
                  <li>Business Model Risk: {user.businessModel.includes('Crypto') ? 'High' : 'Low'}</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Risk Assessment</h2>
          <p className="text-base text-muted-foreground">Risk score history (0-100)</p>
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

      {/* Recent Transactions Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
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

      {/* Risk Alerts Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Risk Alerts</h2>
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
    </div>
  );
};

export default UserDetails;
