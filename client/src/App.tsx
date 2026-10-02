import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/public/HomePage';
import { ProjectDetailsPage } from './pages/public/ProjectDetailsPage';
import { TeacherLoginPage } from './pages/auth/TeacherLoginPage';
import { TeamLeadLoginPage } from './pages/auth/TeamLeadLoginPage';
import { UploadProjectPage } from './pages/team-lead/UploadProjectPage';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetailsPage />} />

          {/* Auth routes */}
          <Route path="/login/teacher" element={<TeacherLoginPage />} />
          <Route path="/login/team-lead" element={<TeamLeadLoginPage />} />

          {/* Protected Team Lead routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={['TEAM_LEAD']}>
                <UploadProjectPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Teacher routes */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                <TeacherDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
