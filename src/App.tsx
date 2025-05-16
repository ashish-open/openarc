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
import TicketsDashboard from "@/pages/TicketsDashboard";
import TransactionsPage from "@/pages/TransactionsPage";
import SettingsPage from "@/pages/SettingsPage";
import PaymentGateway from "@/pages/PaymentGateway";
import PaymentGatewaySubmission from "@/pages/PaymentGatewaySubmission";

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
            
            {/* Protected routes with DashboardLayout */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard (Overview) route */}
              <Route path="/dashboard" element={<Overview />} />
              
              {/* KYC */}
              <Route path="/kyc" element={<KycDashboard />} />
              
              {/* Users */}
              <Route path="/users" element={<UsersList />} />
              
              {/* Risk */}
              <Route path="/risk" element={<RiskDashboard />} />
              
              {/* Transactions */}
              <Route path="/transactions" element={<TransactionsPage />} />
              
              {/* Payment Gateway */}
              <Route path="/payment-gateway" element={<PaymentGateway />} />
              <Route path="/payment-gateway/submission" element={<PaymentGatewaySubmission />} />
              
              {/* Tickets */}
              <Route path="/tickets" element={<TicketsDashboard />} />
              
              {/* Settings */}
              <Route path="/settings" element={
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
