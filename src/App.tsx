
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import PatientRequest from "./pages/PatientRequest";
import PatientRequestReport from "./pages/PatientRequestReport";
import PatientRequestSummaryReport from "./pages/PatientRequestSummaryReport";
import PatientTransfusionHistory from "./pages/PatientTransfusionHistory";
import BloodBleedRecordReport from "./pages/BloodBleedRecordReport";
import RecordGroupWiseReport from "./pages/RecordGroupWiseReport";
import TestPositiveReport from "./pages/TestPositiveReport";
import DonorScreening from "./pages/DonorScreening";
import DonorBleedSummary from "./pages/DonorBleedSummary";
import BagBleedSummary from "./pages/BagBleedSummary";
import BloodIssueRecord from "./pages/BloodIssueRecord";
import TestReportDetail from "./pages/TestReportDetail";
import ProductWiseBloodIssue from "./pages/ProductWiseBloodIssue";
import CrossmatchReport from "./pages/CrossmatchReport";
import DonationsReport from "./pages/DonationsReport";
import BloodDriveReport from "./pages/BloodDriveReport";
import VolunteerReport from "./pages/VolunteerReport";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/landing" element={<Landing />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/user-management" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
              
              {/* Reception Reports */}
              <Route path="/reports/reception/patient-request" element={
                <ProtectedRoute>
                  <PatientRequest />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/reception/patient-request-summary" element={
                <ProtectedRoute>
                  <PatientRequestSummaryReport />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/reception/patient-transfusion-history" element={
                <ProtectedRoute>
                  <PatientTransfusionHistory />
                </ProtectedRoute>
              } />
              
              {/* BDS Reports */}
              <Route path="/reports/bds/blood-bleed-record" element={
                <ProtectedRoute>
                  <BloodBleedRecordReport />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/bds/record-group-wise" element={
                <ProtectedRoute>
                  <RecordGroupWiseReport />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/bds/test-positive" element={
                <ProtectedRoute>
                  <TestPositiveReport />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/bds/donor-screening" element={
                <ProtectedRoute>
                  <DonorScreening />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/bds/donor-bleed-summary" element={
                <ProtectedRoute>
                  <DonorBleedSummary />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/bds/bag-bleed-summary" element={
                <ProtectedRoute>
                  <BagBleedSummary />
                </ProtectedRoute>
              } />
              
              {/* LAB Reports */}
              <Route path="/reports/lab/blood-issue-record" element={
                <ProtectedRoute>
                  <BloodIssueRecord />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/lab/test-report-detail" element={
                <ProtectedRoute>
                  <TestReportDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/lab/product-wise-blood-issue" element={
                <ProtectedRoute>
                  <ProductWiseBloodIssue />
                </ProtectedRoute>
              } />

              <Route path="/reports/lab/crossmatch-report" element={
                <ProtectedRoute>
                  <CrossmatchReport />
                </ProtectedRoute>
              } />
              
              {/* Admin Reports */}
              <Route path="/reports/admin/donations" element={
                <ProtectedRoute>
                  <DonationsReport />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/admin/blood-drive" element={
                <ProtectedRoute>
                  <BloodDriveReport />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/admin/volunteer" element={
                <ProtectedRoute>
                  <VolunteerReport />
                </ProtectedRoute>
              } />
              
              {/* Legacy route for patient request */}
              <Route path="/patient-request" element={
                <ProtectedRoute>
                  <PatientRequestReport />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
