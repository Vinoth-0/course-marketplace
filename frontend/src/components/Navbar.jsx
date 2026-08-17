// Navbar.jsx — role-aware navigation bar
// Renders different links based on auth state and role
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { BookOpen, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  // Active link helper
  const active = (path) =>
    location.pathname === path
      ? 'text-brand-600 font-semibold'
      : 'text-gray-600 hover:text-brand-600'

  // Build link list based on role
  const links = buildLinks(isAuthenticated, role, active)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-lg flex items-center justify-center shadow">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-brand-700 transition-colors">
              Course<span className="text-brand-600">Sphere</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className={`text-sm transition-colors ${active(to)}`}>
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2.5 py-1">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-brand-50"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-1 transition-colors ${active(to)}`}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <span className="text-xs text-gray-400">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-red-600 text-sm font-medium"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-brand-600">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

// Helper — returns nav links based on auth state
function buildLinks(isAuthenticated, role, active) {
  if (!isAuthenticated) {
    return [{ to: '/', label: 'Home' }]
  }
  if (role === 'STUDENT') {
    return [
      { to: '/', label: 'Home' },
      { to: '/student/dashboard', label: 'My Courses' },
      { to: '/student/apply-instructor', label: 'Become Instructor' },
    ]
  }
  if (role === 'INSTRUCTOR') {
    return [
      { to: '/', label: 'Home' },
      { to: '/instructor/dashboard', label: 'My Courses' },
      { to: '/instructor/create', label: 'Create Course' },
    ]
  }
  if (role === 'ADMIN') {
    return [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/applications', label: 'Applications' },
      { to: '/', label: 'All Courses' },
    ]
  }
  return []
}
