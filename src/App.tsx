
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import PatientRequestReport from "./pages/PatientRequestReport";
import PatientRequestSummaryReport from "./pages/PatientRequestSummaryReport";
import PatientTransfusionHistory from "./pages/PatientTransfusionHistory";
import BloodBleedRecordReport from "./pages/BloodBleedRecordReport";
import RecordGroupWiseReport from "./pages/RecordGroupWiseReport";
import TestPositiveReport from "./pages/TestPositiveReport";
import TestReportDetail from "./pages/TestReportDetail";
import PatientWiseBloodIssue from "./pages/PatientWiseBloodIssue";
import ProductWiseBloodIssue from "./pages/ProductWiseBloodIssue";
import DonorScreening from "./pages/DonorScreening";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/reception/patient-request" 
              element={
                <ProtectedRoute>
                  <PatientRequestReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/reception/patient-request-summary" 
              element={
                <ProtectedRoute>
                  <PatientRequestSummaryReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/reception/patient-transfusion-history" 
              element={
                <ProtectedRoute>
                  <PatientTransfusionHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/bds/blood-bleed-record" 
              element={
                <ProtectedRoute>
                  <BloodBleedRecordReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/bds/record-group-wise" 
              element={
                <ProtectedRoute>
                  <RecordGroupWiseReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/bds/test-positive" 
              element={
                <ProtectedRoute>
                  <TestPositiveReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/bds/donor-screening" 
              element={
                <ProtectedRoute>
                  <DonorScreening />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/lab/test-report-detail" 
              element={
                <ProtectedRoute>
                  <TestReportDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/lab/patient-wise-blood-issue" 
              element={
                <ProtectedRoute>
                  <PatientWiseBloodIssue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/lab/product-wise-blood-issue" 
              element={
                <ProtectedRoute>
                  <ProductWiseBloodIssue />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
