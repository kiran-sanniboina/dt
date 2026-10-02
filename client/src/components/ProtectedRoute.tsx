import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Array<'TEACHER' | 'ADMIN' | 'TEAM_LEAD'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-rgukt-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Validating institutional credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If attempting to access teacher routes, redirect to teacher login
    if (allowedRoles?.includes('TEACHER')) {
      return <Navigate to="/login/teacher" state={{ from: location }} replace />;
    }
    // If team lead
    return <Navigate to="/login/team-lead" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Role not authorized
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-2xl border border-red-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Access Restricted</h2>
        <p className="text-sm text-slate-600 mb-4">
          Your account role (<span className="font-semibold">{role}</span>) does not have permission to access this portal.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};
