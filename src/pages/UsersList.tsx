
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for users
const usersData = [
  { id: 'U10001', name: 'John Doe', email: 'john.doe@example.com', kycStatus: 'verified', riskLevel: 'low', lastActivity: '2023-06-01', country: 'United States' },
  { id: 'U10002', name: 'Sarah Smith', email: 'sarah.smith@example.com', kycStatus: 'verified', riskLevel: 'medium', lastActivity: '2023-06-02', country: 'Canada' },
  { id: 'U10003', name: 'Michael Brown', email: 'michael.brown@example.com', kycStatus: 'pending', riskLevel: 'medium', lastActivity: '2023-06-03', country: 'United Kingdom' },
  { id: 'U10004', name: 'Emma Wilson', email: 'emma.wilson@example.com', kycStatus: 'rejected', riskLevel: 'high', lastActivity: '2023-06-03', country: 'Australia' },
  { id: 'U10005', name: 'James Taylor', email: 'james.taylor@example.com', kycStatus: 'verified', riskLevel: 'low', lastActivity: '2023-06-04', country: 'Germany' },
  { id: 'U10006', name: 'Lisa Johnson', email: 'lisa.johnson@example.com', kycStatus: 'pending', riskLevel: 'low', lastActivity: '2023-06-04', country: 'France' },
  { id: 'U10007', name: 'Robert Martin', email: 'robert.martin@example.com', kycStatus: 'verified', riskLevel: 'medium', lastActivity: '2023-06-05', country: 'Spain' },
  { id: 'U10008', name: 'Patricia White', email: 'patricia.white@example.com', kycStatus: 'verified', riskLevel: 'low', lastActivity: '2023-06-05', country: 'Italy' },
  { id: 'U10009', name: 'Daniel Lee', email: 'daniel.lee@example.com', kycStatus: 'rejected', riskLevel: 'high', lastActivity: '2023-06-06', country: 'Japan' },
  { id: 'U10010', name: 'Karen Davis', email: 'karen.davis@example.com', kycStatus: 'verified', riskLevel: 'low', lastActivity: '2023-06-07', country: 'Brazil' },
];

const UsersList: React.FC = () => {
  useRequireAuth('viewer');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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

  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8 max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-left">ID</th>
                  <th className="pb-2 font-medium text-left">Name</th>
                  <th className="pb-2 font-medium text-left hidden md:table-cell">Email</th>
                  <th className="pb-2 font-medium text-left">KYC Status</th>
                  <th className="pb-2 font-medium text-left">Risk Level</th>
                  <th className="pb-2 font-medium text-left hidden md:table-cell">Country</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{user.id}</td>
                    <td className="py-3">{user.name}</td>
                    <td className="py-3 hidden md:table-cell">{user.email}</td>
                    <td className="py-3">{getKycBadge(user.kycStatus)}</td>
                    <td className="py-3">{getRiskBadge(user.riskLevel)}</td>
                    <td className="py-3 hidden md:table-cell">{user.country}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/users/${user.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No users found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersList;
