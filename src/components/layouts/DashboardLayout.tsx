import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, AlertCircle, Ticket, Settings, ArrowLeft, File, Activity, ListVideo, Home, IdCard, ShieldAlert, LifeBuoy } from 'lucide-react';
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
      icon: Home,
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
      icon: IdCard,
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
      icon: ShieldAlert,
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
      icon: LifeBuoy,
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
      icon: Settings,
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
        <Sidebar className={collapsed ? 'w-16 transition-all duration-300' : 'w-64 transition-all duration-300'}>
          <div className="h-full flex flex-col">
            <div className={`flex items-center justify-center p-4 ${collapsed ? 'px-0' : ''}`}>
              <Link to="/dashboard" className="flex items-center w-full justify-center">
                <h1 className={`font-bold text-xl text-rebecca-dark transition-all duration-300 ${collapsed ? 'text-center w-full' : ''}`}>OpenArc</h1>
              </Link>
            </div>
            <SidebarContent className="flex-1">
              {sections.filter(section => section.name !== 'Administration').map((section) => (
                <SidebarGroup key={section.name}>
                  {!collapsed && (
                    <SidebarGroupLabel className="text-rebecca-light pl-4 pt-2 pb-1 text-xs uppercase tracking-wider flex items-center gap-2">
                      {section.icon && <section.icon className="h-4 w-4 mr-1" />}
                      {section.name}
                    </SidebarGroupLabel>
                  )}
                  {collapsed && (
                    <SidebarGroupLabel className="flex items-center justify-center pt-2 pb-1">
                      {section.icon && <section.icon className="h-5 w-5" />}
                    </SidebarGroupLabel>
                  )}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        checkUserAccess(item.requiredRole as any) && (
                          <SidebarMenuItem key={item.path} className={`my-1 ${collapsed ? 'flex justify-center' : ''}`}>
                            <SidebarMenuButton asChild>
                              <Link to={item.path} className={`flex items-center w-full px-2 py-2 rounded-md transition-colors duration-200 hover:bg-rebecca-light/10 ${collapsed ? 'justify-center' : 'pl-4'}`}>
                                <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
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
            {/* Settings and Logout at the bottom */}
            <div className={`mt-auto pt-4 pb-4 border-t flex flex-col gap-2 ${collapsed ? 'items-center pt-2 pb-2 border-t-0' : ''}`}>
              {checkUserAccess('admin') && (
                <SidebarMenu>
                  <SidebarMenuItem className={collapsed ? 'flex justify-center' : ''}>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/settings" className={`flex items-center w-full px-2 py-2 rounded-md transition-colors duration-200 hover:bg-rebecca-light/10 ${collapsed ? 'justify-center' : 'pl-4'}`}>
                        <Settings className="h-5 w-5" />
                        {!collapsed && <span className="ml-2">Settings</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
              <SidebarMenu>
                <SidebarMenuItem className={collapsed ? 'flex justify-center' : ''}>
                  <SidebarMenuButton asChild>
                    <button onClick={handleLogout} className={`flex items-center w-full px-2 py-2 rounded-md transition-colors duration-200 hover:bg-rebecca-light/10 ${collapsed ? 'justify-center' : 'pl-4'}`}>
                      <AlertCircle className="h-5 w-5" />
                      {!collapsed && <span className="ml-2">Logout</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className={`mt-2 ${collapsed ? 'mx-auto' : 'ml-auto'}`}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ArrowLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </Sidebar>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 animate-fade-in flex flex-col">
            {/* User profile dropdown at the top right */}
            <div className="flex justify-end mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-rebecca-dark">
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
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
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
