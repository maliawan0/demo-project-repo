import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InputFormPage from "./pages/InputFormPage";
import ReviewPage from "./pages/ReviewPage";
import DashboardPage from "./pages/DashboardPage";
import EvidencePackPage from "./pages/EvidencePackPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Layout/Header";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AnalysisHistoryPage from "./pages/AnalysisHistoryPage"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/input-form" element={<InputFormPage />} />
                  <Route path="/review-suggestions" element={<ReviewPage />} />
                  <Route path="/budget-impact" element={<DashboardPage />} />
                  <Route path="/evidence-pack" element={<EvidencePackPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/my-analyses" element={<AnalysisHistoryPage />} /> {/* New protected route */}
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;