import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import DiplomatChatPage from "./pages/DiplomatChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PricingPage from "./pages/PricingPage";
import GrowthPlanPage from "./pages/GrowthPlanPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Detect if we're on diplomat subdomain
const isDiplomatSubdomain = () => {
  const hostname = window.location.hostname;
  return hostname.startsWith('diplomat.') || hostname.includes('diplomat');
};

function App() {
  // If on diplomat subdomain, show Diplomat chat directly
  const showDiplomat = isDiplomatSubdomain();

  return (
    <div className="App min-h-screen bg-background">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {showDiplomat ? (
              // Diplomat subdomain routes
              <>
                <Route path="/" element={<DiplomatChatPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              // Main domain routes
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/diplomat" element={<DiplomatChatPage />} />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } 
                />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
