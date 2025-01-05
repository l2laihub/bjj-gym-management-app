import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRoles } from '../../hooks/useRoles';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: rolesLoading, error } = useRoles();
  const location = useLocation();

  // Show loading state
  if (authLoading || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle role loading errors
  if (error) {
    console.error('Role loading error:', error);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}