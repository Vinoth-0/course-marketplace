// App.jsx — root component: wraps everything in AuthProvider + BrowserRouter
// Defines all routes with role-based protection
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CourseDetailPage from './pages/CourseDetailPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import ApplyInstructorPage from './pages/student/ApplyInstructorPage'

// Instructor pages
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import CreateCoursePage from './pages/instructor/CreateCoursePage'
import ManageCoursePage from './pages/instructor/ManageCoursePage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ApplicationsPage from './pages/admin/ApplicationsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar is rendered on every page */}
        <Navbar />

        <main>
          <Routes>
            {/* ── Public routes ────────────────────────────────────────── */}
            <Route path="/"           element={<HomePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />

            {/* ── Student routes (STUDENT role required) ───────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route path="/student/dashboard"        element={<StudentDashboard />} />
              <Route path="/student/apply-instructor" element={<ApplyInstructorPage />} />
            </Route>

            {/* ── Instructor routes (INSTRUCTOR role required) ──────────── */}
            <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} />}>
              <Route path="/instructor/dashboard"     element={<InstructorDashboard />} />
              <Route path="/instructor/create"        element={<CreateCoursePage />} />
              <Route path="/instructor/manage/:id"    element={<ManageCoursePage />} />
            </Route>

            {/* ── Admin routes (ADMIN role required) ───────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard"    element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<ApplicationsPage />} />
            </Route>

            {/* ── Catch-all → redirect to home ─────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}
