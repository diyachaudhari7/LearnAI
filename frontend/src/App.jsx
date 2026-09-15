import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Public & Landing Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// Authenticated Application Shell
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Feature Pages
import DashboardPage from './pages/DashboardPage';
import MyMaterialsPage from './pages/MyMaterialsPage';
import UploadMaterialPage from './pages/UploadMaterialPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import AISummaryPage from './pages/AISummaryPage';
import QuizListPage from './pages/QuizListPage';
import QuizActivePage from './pages/QuizActivePage';
import QuizResultPage from './pages/QuizResultPage';
import FlashcardsPage from './pages/FlashcardsPage';
import CompetencyPage from './pages/CompetencyPage';
import LearningPathPage from './pages/LearningPathPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes inside Main Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/materials" element={<MyMaterialsPage />} />
              <Route path="/upload" element={<UploadMaterialPage />} />
              <Route path="/materials/:id" element={<MaterialDetailPage />} />
              <Route path="/summary/:id" element={<AISummaryPage />} />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quiz/:id" element={<QuizActivePage />} />
              <Route path="/quiz/:id/result" element={<QuizResultPage />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/competency" element={<CompetencyPage />} />
              <Route path="/learning-path" element={<LearningPathPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
