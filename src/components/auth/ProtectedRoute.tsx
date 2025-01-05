import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAdmin, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
