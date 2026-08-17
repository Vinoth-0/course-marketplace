// AdminDashboard.jsx — overview of all users and all courses
// GET /api/admin/users   → user list
// GET /api/courses       → all courses
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import { Users, BookOpen, ShieldCheck, ClipboardList } from 'lucide-react'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'courses'

  useEffect(() => {
    fetchUsers()
    fetchCourses()
  }, [])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const { data } = await axiosInstance.get('/api/admin/users')
      setUsers(data)
    } catch {
      toast.error('Failed to load users.')
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchCourses = async () => {
    setLoadingCourses(true)
    try {
      const { data } = await axiosInstance.get('/api/courses')
      setCourses(data)
    } catch {
      toast.error('Failed to load courses.')
    } finally {
      setLoadingCourses(false)
    }
  }

  // Role badge colours
  const roleBadge = (role) => {
    const map = {
      ADMIN:      'bg-red-100 text-red-700',
      INSTRUCTOR: 'bg-blue-100 text-blue-700',
      STUDENT:    'bg-green-100 text-green-700',
    }
    return map[role] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="page-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
          <ShieldCheck size={24} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Platform overview and management</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-brand-600 bg-brand-50' },
          { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-yellow-600 bg-yellow-50' },
          {
            label: 'Pending Applications',
            value: '—',
            icon: ClipboardList,
            color: 'text-orange-600 bg-orange-50',
            link: '/admin/applications',
          },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">
                {link ? (
                  <Link to={link} className="text-brand-600 hover:underline">{label}</Link>
                ) : label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {[
          { key: 'users', label: 'Users', icon: Users },
          { key: 'courses', label: 'Courses', icon: BookOpen },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === key ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Users table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loadingUsers ? (
            <Spinner />
          ) : users.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No users found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name || u.email}</td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Courses table */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loadingCourses ? (
            <Spinner />
          ) : courses.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No courses found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Instructor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Price</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 line-clamp-1">{c.title}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{c.instructorName || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      {c.price === 0 || !c.price ? 'Free' : `$${c.price}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/courses/${c.id}`} className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
