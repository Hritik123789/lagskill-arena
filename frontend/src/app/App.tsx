import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DemoPage } from './pages/DemoPage';
import { SessionReportPage } from './pages/SessionReportPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { UpgradePage } from './pages/UpgradePage';
import LeaderboardPage from './pages/LeaderboardPage';
import HighlightsPage from './pages/HighlightsPage';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#0d1117] text-gray-100">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/highlights" element={<HighlightsPage />} />
              <Route path="/report" element={<SessionReportPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/session/:sessionId" element={<SessionDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/upgrade" element={<UpgradePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
