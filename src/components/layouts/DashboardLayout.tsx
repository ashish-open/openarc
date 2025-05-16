import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, AlertCircle, Ticket, Settings, ArrowLeft, File, Activity, ListVideo, Home, IdCard, ShieldAlert, LifeBuoy, CreditCard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import OpenArcLogo from '@/components/OpenArcLogo';

const DashboardLayout: React.FC = () => {
  const { user, logout, checkUserAccess } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          path: '/kyc', 
          icon: File, 
          requiredRole: 'viewer' 
        },
        { 
          name: 'Users', 
          path: '/users', 
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
          path: '/risk', 
          icon: Activity, 
          requiredRole: 'viewer' 
        },
        { 
          name: 'Transactions', 
          path: '/transactions', 
          icon: ListVideo, 
          requiredRole: 'viewer' 
        }
      ]
    },
    {
      name: "Payments",
      icon: null,
      items: [
        {
          name: 'Payment Gateway',
          path: '/payment-gateway',
          icon: CreditCard,
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
          path: '/tickets', 
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
          path: '/settings', 
          icon: Settings, 
          requiredRole: 'admin' 
        }
      ]
    }
  ];

  // Flatten all items from all sections
  const sidebarItems = sections
    .filter(section => section.name !== 'Administration')
    .flatMap(section => section.items.map(item => ({ ...item })));

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          <div className="h-full flex flex-col">
            <SidebarHeader>
              <div style={{ height: 48, margin: '8px auto' }} />
            </SidebarHeader>
            <SidebarContent className="flex-1">
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    checkUserAccess(item.requiredRole as any) && (
                      <SidebarMenuItem key={item.path} className={`my-1 ${collapsed ? 'flex justify-center' : ''}`}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.path} className={`flex items-center w-full px-2 py-2 rounded-md transition-colors duration-200 hover:bg-rebecca-light/10 ${collapsed ? 'justify-center' : 'pl-4'}`}>
                            {item.icon && <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} fill={isActive ? '#663399' : 'none'} />}
                            {!collapsed && <span>{item.name}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
            {/* Settings and Logout at the bottom */}
            <div className={`mt-auto pt-4 pb-4 border-t flex flex-col gap-2 ${collapsed ? 'items-center pt-2 pb-2 border-t-0' : ''}`}>
              {checkUserAccess('admin') && (
                <SidebarMenu>
                  <SidebarMenuItem className={collapsed ? 'flex justify-center' : ''}>
                    <SidebarMenuButton asChild>
                      <Link to="/settings" className={`flex items-center w-full px-2 py-2 rounded-md transition-colors duration-200 hover:bg-rebecca-light/10 ${collapsed ? 'justify-center' : 'pl-4'}`}>
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
                      <ArrowLeft className="h-5 w-5" />
                      {!collapsed && <span className="ml-2">Logout</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </div>
        </Sidebar>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;