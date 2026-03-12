// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Creators from "./pages/Creators";
import Jobs from "./pages/Jobs";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";

import BrandJobs from "./pages/dashboard/BrandJobs";
import Portfolio from "./pages/dashboard/Portfolio";
import MyContent from "./pages/dashboard/MyContent";
import ProfilePage from "./pages/dashboard/ProfilePage";
import MessagesList from "./pages/dashboard/MessagesList";
import JobMessages from "./pages/dashboard/JobMessages";
import DashboardJobs from "./pages/dashboard/DashboardJobs";

import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <Routes>

              <Route path="/" element={<Index />} />

              <Route path="/creators" element={<Creators />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId" element={<JobDetail />} />
              <Route path="/library" element={<Library />} />

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
                path="/dashboard/jobs"
                element={
                  <ProtectedRoute>
                    <DashboardJobs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/my-jobs"
                element={
                  <ProtectedRoute allowedRoles={["brand"]}>
                    <BrandJobs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/portfolio"
                element={
                  <ProtectedRoute allowedRoles={["creator"]}>
                    <Portfolio />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/my-content"
                element={
                  <ProtectedRoute allowedRoles={["creator"]}>
                    <MyContent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <MessagesList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/messages/:jobId"
                element={
                  <ProtectedRoute>
                    <JobMessages />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />

            </Routes>

          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;