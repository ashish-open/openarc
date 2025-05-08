
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/hooks/useProtectedRoute";

// Layouts
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Public pages
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";

// Dashboard pages
import Dashboard from "@/pages/Dashboard";
import KycDashboard from "@/pages/KycDashboard";
import RiskDashboard from "@/pages/RiskDashboard";
import UsersList from "@/pages/UsersList";
import UserDetails from "@/pages/UserDetails";
import TicketsDashboard from "@/pages/TicketsDashboard";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="kyc" element={<KycDashboard />} />
              <Route path="risk" element={<RiskDashboard />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/:userId" element={<UserDetails />} />
              <Route path="tickets" element={<TicketsDashboard />} />
              <Route path="settings" element={
                <ProtectedRoute requiredRole="admin">
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={<Login />} />
            
            {/* Catch all */}
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
