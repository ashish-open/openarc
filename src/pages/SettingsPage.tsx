
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRequireAuth, UserRole } from '@/hooks/useRequireAuth';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface UserAccessItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const mockUsers: UserAccessItem[] = [
  { id: 'UA001', email: 'john.admin@example.com', name: 'John Admin', role: 'admin' },
  { id: 'UA002', email: 'sarah.viewer@example.com', name: 'Sarah Viewer', role: 'viewer' },
  { id: 'UA003', email: 'mike.admin@example.com', name: 'Mike Admin', role: 'admin' },
  { id: 'UA004', email: 'emma.viewer@example.com', name: 'Emma Viewer', role: 'viewer' },
];

const SettingsPage: React.FC = () => {
  useRequireAuth('admin');
  const { toast } = useToast();
  const [accessUsers, setAccessUsers] = useState<UserAccessItem[]>(mockUsers);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer');

  const [apiSettings, setApiSettings] = useState({
    freshdeskApiKey: '************************',
    freshdeskDomain: 'mycompany.freshdesk.com',
    awsRegion: 'us-west-2',
    lambdaFunctionName: 'kyc-risk-lambda',
    notificationsEnabled: true,
    emailNotifications: true,
    slackNotifications: false,
  });

  const handleAddUser = () => {
    if (!newUserEmail || !newUserName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newUser: UserAccessItem = {
      id: `UA${Math.floor(Math.random() * 1000)}`,
      email: newUserEmail,
      name: newUserName,
      role: newUserRole,
    };

    setAccessUsers([...accessUsers, newUser]);
    setNewUserEmail('');
    setNewUserName('');
    setNewUserRole('viewer');

    toast({
      title: "Success",
      description: "User access has been added",
    });
  };

  const handleRemoveUser = (id: string) => {
    setAccessUsers(accessUsers.filter(user => user.id !== id));
    toast({
      title: "Success",
      description: "User access has been removed",
    });
  };

  const handleUpdateUserRole = (id: string, newRole: UserRole) => {
    setAccessUsers(accessUsers.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
    toast({
      title: "Success",
      description: "User role has been updated",
    });
  };

  const handleSaveApiSettings = () => {
    toast({
      title: "Success",
      description: "API settings have been saved",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="access" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="access">Access Management</TabsTrigger>
          <TabsTrigger value="api">API Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="access" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Access</CardTitle>
              <CardDescription>Manage user access to the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-2 font-medium text-left">Name</th>
                          <th className="pb-2 font-medium text-left">Email</th>
                          <th className="pb-2 font-medium text-left">Role</th>
                          <th className="pb-2 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-3">{user.name}</td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3">
                              <Select 
                                value={user.role} 
                                onValueChange={(value: string) => handleUpdateUserRole(user.id, value as UserRole)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="super-admin">Super Admin</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveUser(user.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <CardTitle className="text-md mb-4">Add New User</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={newUserName} 
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={newUserEmail} 
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="john.doe@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={newUserRole} 
                        onValueChange={(value: string) => setNewUserRole(value as UserRole)}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super-admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleAddUser}
                        className="w-full md:w-auto"
                      >
                        Add User
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FreshDesk Integration</CardTitle>
              <CardDescription>Configure your FreshDesk API settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="freshdesk-key">API Key</Label>
                    <Input 
                      id="freshdesk-key" 
                      type="password" 
                      value={apiSettings.freshdeskApiKey} 
                      onChange={(e) => setApiSettings({...apiSettings, freshdeskApiKey: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freshdesk-domain">FreshDesk Domain</Label>
                    <Input 
                      id="freshdesk-domain" 
                      value={apiSettings.freshdeskDomain} 
                      onChange={(e) => setApiSettings({...apiSettings, freshdeskDomain: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AWS Configuration</CardTitle>
              <CardDescription>Configure your AWS settings for backend processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aws-region">AWS Region</Label>
                    <Input 
                      id="aws-region" 
                      value={apiSettings.awsRegion} 
                      onChange={(e) => setApiSettings({...apiSettings, awsRegion: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lambda-name">Lambda Function Name</Label>
                    <Input 
                      id="lambda-name" 
                      value={apiSettings.lambdaFunctionName} 
                      onChange={(e) => setApiSettings({...apiSettings, lambdaFunctionName: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-toggle" className="font-medium">Enable Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications for important events</p>
                  </div>
                  <Switch 
                    id="notifications-toggle" 
                    checked={apiSettings.notificationsEnabled}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, notificationsEnabled: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-toggle" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email-toggle" 
                    checked={apiSettings.emailNotifications}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, emailNotifications: checked})}
                    disabled={!apiSettings.notificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="slack-toggle" className="font-medium">Slack Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications in Slack</p>
                  </div>
                  <Switch 
                    id="slack-toggle" 
                    checked={apiSettings.slackNotifications}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, slackNotifications: checked})}
                    disabled={!apiSettings.notificationsEnabled}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveApiSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
