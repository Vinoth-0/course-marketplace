// InstructorDashboard.jsx — shows all courses created by the logged-in instructor
// GET /api/courses/my
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Plus, BookOpen, Pencil, Users } from 'lucide-react'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/api/courses/my')
      setCourses(data)
    } catch (err) {
      toast.error('Failed to load your courses.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
            <LayoutDashboard size={24} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Instructor Dashboard</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/instructor/create"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow"
        >
          <Plus size={16} /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-brand-600 bg-brand-50' },
          { label: 'Total Lectures', value: courses.reduce((a, c) => a + (c.lectures?.length || 0), 0), icon: BookOpen, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Total Students', value: courses.reduce((a, c) => a + (c.enrollmentCount || 0), 0), icon: Users, color: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Courses table */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">My Courses</h2>

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No courses yet</h3>
          <p className="text-sm text-gray-400 mt-1 mb-5">Create your first course to start earning.</p>
          <Link
            to="/instructor/create"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> Create a Course
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Lectures</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Price</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{course.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{course.description}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                    {course.lectures?.length || 0}
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    {course.price === 0 || !course.price ? 'Free' : `$${course.price}`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/instructor/manage/${course.id}`}
                      className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-medium transition-colors"
                    >
                      <Pencil size={14} /> Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
