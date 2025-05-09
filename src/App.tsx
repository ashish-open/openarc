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
import Overview from "@/pages/Overview";
import Dashboard from "@/pages/Dashboard";
import KycDashboard from "@/pages/KycDashboard";
import RiskDashboard from "@/pages/RiskDashboard";
import UsersList from "@/pages/UsersList";
import UserDetails from "@/pages/UserDetails";
import CreateUser from "@/pages/CreateUser";
import TicketsDashboard from "@/pages/TicketsDashboard";
import TransactionsPage from "@/pages/TransactionsPage";
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
            {/* Dashboard (Overview) route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Overview />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* KYC */}
            <Route path="/kyc" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <KycDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* Users */}
            <Route path="/users" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsersList />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/users/create" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateUser />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/users/:userId" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserDetails />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* Risk */}
            <Route path="/risk" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RiskDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* Transactions */}
            <Route path="/transactions" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TransactionsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* Tickets */}
            <Route path="/tickets" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TicketsDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* Settings */}
            <Route path="/settings" element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
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
