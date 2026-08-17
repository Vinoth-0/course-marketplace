// ProtectedRoute.jsx — guards pages based on auth state and role
// Usage: <ProtectedRoute allowedRoles={['STUDENT']} />
// - If not authenticated → redirect to /login
// - If authenticated but wrong role → redirect to /
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    // Not logged in — send to login, remember where they came from
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but wrong role — send to home
    return <Navigate to="/" replace />
  }

  // All good — render child routes
  return <Outlet />
}
