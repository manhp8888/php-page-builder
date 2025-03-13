
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import ActivityEvaluation from "./pages/ActivityEvaluation";
import Students from "./pages/Students";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import MyRegistrations from "./pages/MyRegistrations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            
            {/* Routes available to all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Teacher-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/activities/:id/evaluate" element={<ActivityEvaluation />} />
              <Route path="/students" element={<Students />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
            
            {/* Student-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/my-registrations" element={<MyRegistrations />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
