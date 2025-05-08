
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { UserRole } from '@/context/AuthContext';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  isTwoFactorAuthEnabled: boolean;
}

interface UserPageAccess {
  overview: boolean;
  kyc: boolean;
  users: boolean;
  risk: boolean;
  transactions: boolean;
  tickets: boolean;
}

interface FreshdeskConfig {
  apiKey: string;
  domain: string;
  isConnected: boolean;
}

// Mock data for user management
const mockUsers = [
  { id: '1', name: 'Super Admin', email: 'admin@example.com', role: 'super-admin' as UserRole, status: 'active' },
  { id: '2', name: 'Admin User', email: 'manager@example.com', role: 'admin' as UserRole, status: 'active' },
  { id: '3', name: 'View Only', email: 'viewer@example.com', role: 'viewer' as UserRole, status: 'active' },
  { id: '4', name: 'James Smith', email: 'james@example.com', role: 'viewer' as UserRole, status: 'inactive' },
];

const SettingsPage: React.FC = () => {
  useRequireAuth('admin');

  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    isTwoFactorAuthEnabled: false,
  });

  const [userManagement, setUserManagement] = useState({
    users: mockUsers,
    newUser: {
      name: '',
      email: '',
      role: 'viewer' as UserRole,
      pageAccess: {
        overview: true,
        kyc: true,
        users: true,
        risk: true,
        transactions: true,
        tickets: true
      } as UserPageAccess
    }
  });

  const [freshdeskConfig, setFreshdeskConfig] = useState<FreshdeskConfig>({
    apiKey: '',
    domain: '',
    isConnected: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    setProfile(prev => ({ ...prev, role }));
  };

  const handleTwoFactorAuthChange = (checked: boolean) => {
    setProfile(prev => ({ ...prev, isTwoFactorAuthEnabled: checked }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleFreshdeskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freshdeskConfig.apiKey || !freshdeskConfig.domain) {
      toast.error('Please provide both API key and domain');
      return;
    }
    
    setFreshdeskConfig(prev => ({ ...prev, isConnected: true }));
    toast.success('Freshdesk integration configured successfully!');
  };

  const handleNewUserChange = (field: string, value: string) => {
    setUserManagement(prev => ({
      ...prev,
      newUser: {
        ...prev.newUser,
        [field]: value
      }
    }));
  };

  const handlePageAccessToggle = (page: keyof UserPageAccess) => {
    setUserManagement(prev => ({
      ...prev,
      newUser: {
        ...prev.newUser,
        pageAccess: {
          ...prev.newUser.pageAccess,
          [page]: !prev.newUser.pageAccess[page]
        }
      }
    }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, role } = userManagement.newUser;
    
    if (!name || !email) {
      toast.error('Please provide both name and email');
      return;
    }
    
    setUserManagement(prev => ({
      ...prev,
      users: [
        ...prev.users,
        { id: String(prev.users.length + 1), name, email, role, status: 'active' }
      ],
      newUser: {
        name: '',
        email: '',
        role: 'viewer',
        pageAccess: {
          overview: true,
          kyc: true,
          users: true,
          risk: true,
          transactions: true,
          tickets: true
        }
      }
    }));
    
    toast.success(`User ${name} created successfully!`);
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your profile settings.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleRoleChange(value as UserRole)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={profile.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleProfileSubmit}>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure your security settings.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <Switch
                  id="2fa"
                  checked={profile.isTwoFactorAuthEnabled}
                  onCheckedChange={handleTwoFactorAuthChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input type="password" id="current-password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input type="password" id="new-password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input type="password" id="confirm-password" />
              </div>
              <Button onClick={handleProfileSubmit}>Update Security</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage user accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 font-medium text-left">Name</th>
                        <th className="pb-2 font-medium text-left">Email</th>
                        <th className="pb-2 font-medium text-left">Role</th>
                        <th className="pb-2 font-medium text-left">Status</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userManagement.users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3 capitalize">{user.role}</td>
                          <td className="py-3">
                            {user.status === 'active' ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>Add a new user to the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-user-name">Name</Label>
                    <Input 
                      id="new-user-name"
                      value={userManagement.newUser.name}
                      onChange={(e) => handleNewUserChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-user-email">Email</Label>
                    <Input 
                      id="new-user-email"
                      type="email"
                      value={userManagement.newUser.email}
                      onChange={(e) => handleNewUserChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-user-role">Role</Label>
                    <Select 
                      value={userManagement.newUser.role}
                      onValueChange={(value) => handleNewUserChange('role', value)}
                    >
                      <SelectTrigger id="new-user-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Page Access</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-overview" className="cursor-pointer">Overview Page</Label>
                        <Switch
                          id="access-overview"
                          checked={userManagement.newUser.pageAccess.overview}
                          onCheckedChange={() => handlePageAccessToggle('overview')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-kyc" className="cursor-pointer">KYC Onboarding</Label>
                        <Switch
                          id="access-kyc"
                          checked={userManagement.newUser.pageAccess.kyc}
                          onCheckedChange={() => handlePageAccessToggle('kyc')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-users" className="cursor-pointer">Users Management</Label>
                        <Switch
                          id="access-users"
                          checked={userManagement.newUser.pageAccess.users}
                          onCheckedChange={() => handlePageAccessToggle('users')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-risk" className="cursor-pointer">Risk Monitoring</Label>
                        <Switch
                          id="access-risk"
                          checked={userManagement.newUser.pageAccess.risk}
                          onCheckedChange={() => handlePageAccessToggle('risk')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-transactions" className="cursor-pointer">Transactions</Label>
                        <Switch
                          id="access-transactions"
                          checked={userManagement.newUser.pageAccess.transactions}
                          onCheckedChange={() => handlePageAccessToggle('transactions')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-tickets" className="cursor-pointer">Tickets</Label>
                        <Switch
                          id="access-tickets"
                          checked={userManagement.newUser.pageAccess.tickets}
                          onCheckedChange={() => handlePageAccessToggle('tickets')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit">Create User</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Freshdesk Integration</CardTitle>
              <CardDescription>Configure Freshdesk for ticket management.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFreshdeskSubmit} className="space-y-4">
                {freshdeskConfig.isConnected ? (
                  <div className="bg-green-50 border border-green-100 p-4 rounded-md mb-4">
                    <p className="text-green-800 font-medium">Freshdesk is connected</p>
                    <p className="text-sm text-green-600">Domain: {freshdeskConfig.domain}</p>
                  </div>
                ) : null}
                <div className="grid gap-2">
                  <Label htmlFor="freshdesk-domain">Freshdesk Domain</Label>
                  <Input
                    id="freshdesk-domain"
                    placeholder="your-company.freshdesk.com"
                    value={freshdeskConfig.domain}
                    onChange={(e) => setFreshdeskConfig(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="freshdesk-api-key">API Key</Label>
                  <Input
                    id="freshdesk-api-key"
                    type="password"
                    placeholder="Enter your Freshdesk API key"
                    value={freshdeskConfig.apiKey}
                    onChange={(e) => setFreshdeskConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">
                    You can find your API key in Freshdesk under Profile Settings &gt; API Key
                  </p>
                </div>
                <Button type="submit">
                  {freshdeskConfig.isConnected ? 'Update Connection' : 'Connect Freshdesk'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
