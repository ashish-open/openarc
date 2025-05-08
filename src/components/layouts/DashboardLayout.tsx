
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, AlertCircle, Ticket, Settings, ArrowLeft, File, Activity, ListVideo } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const DashboardLayout: React.FC = () => {
  const { user, logout, checkUserAccess } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define menu items with sections
  const sections = [
    {
      name: "Main",
      items: [
        { 
          name: 'Overview', 
          path: '/dashboard', 
          icon: LayoutDashboard, 
          requiredRole: 'viewer' 
        },
      ]
    },
    {
      name: "KYC",
      items: [
        { 
          name: 'Onboarding', 
          path: '/dashboard/kyc', 
          icon: File, 
          requiredRole: 'viewer' 
        },
        { 
          name: 'Users', 
          path: '/dashboard/users', 
          icon: Users, 
          requiredRole: 'viewer' 
        }
      ]
    },
    {
      name: "Risk",
      items: [
        { 
          name: 'Monitoring', 
          path: '/dashboard/risk', 
          icon: Activity, 
          requiredRole: 'viewer' 
        },
        { 
          name: 'Transactions', 
          path: '/dashboard/transactions', 
          icon: ListVideo, 
          requiredRole: 'viewer' 
        }
      ]
    },
    {
      name: "Support",
      items: [
        { 
          name: 'Tickets', 
          path: '/dashboard/tickets', 
          icon: Ticket, 
          requiredRole: 'viewer' 
        }
      ]
    },
    {
      name: "Administration",
      items: [
        { 
          name: 'Settings', 
          path: '/dashboard/settings', 
          icon: Settings, 
          requiredRole: 'admin' 
        }
      ]
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center p-4">
              <Link to="/dashboard" className="flex items-center">
                {!collapsed && (
                  <h1 className="font-bold text-xl text-rebecca-dark">KYC Risk Dashboard</h1>
                )}
                {collapsed && (
                  <h1 className="font-bold text-xl text-rebecca-dark">KR</h1>
                )}
              </Link>
            </div>
            <SidebarContent>
              {sections.map((section) => (
                <SidebarGroup key={section.name}>
                  <SidebarGroupLabel className="text-rebecca-light">{section.name}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        checkUserAccess(item.requiredRole as any) && (
                          <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton asChild>
                              <Link to={item.path} className="flex items-center">
                                <item.icon className="mr-2 h-5 w-5" />
                                {!collapsed && <span>{item.name}</span>}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
            
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between">
                {!collapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center w-full justify-start p-0 hover:bg-transparent">
                        <Avatar className="h-8 w-8 mr-2 bg-rebecca-dark">
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {collapsed && (
                  <Avatar className="h-8 w-8 cursor-pointer bg-rebecca-dark" onClick={() => navigate('/dashboard/profile')}>
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCollapsed(!collapsed)}
                  className="ml-2"
                >
                  <ArrowLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </Sidebar>
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
