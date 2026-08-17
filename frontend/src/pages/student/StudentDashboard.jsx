// StudentDashboard.jsx — shows enrolled courses for the current student
// GET /api/enrollments/my
import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import CourseCard from '../../components/CourseCard'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import { GraduationCap, BookOpen } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/api/enrollments/my-courses')
      // API returns enrollment objects with a nested "course" property
      const courses = data.map((e) => e.course || e)
      setEnrollments(courses)
    } catch (err) {
      toast.error('Failed to load your enrollments.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
          <GraduationCap size={24} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Learning</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Enrolled Courses', value: enrollments.length, color: 'bg-brand-600' },
          { label: 'In Progress', value: enrollments.length, color: 'bg-yellow-500' },
          { label: 'Completed', value: 0, color: 'bg-green-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-3 h-10 ${color} rounded-full`} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Course list */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Enrolled Courses</h2>

      {loading ? (
        <Spinner />
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No courses yet</h3>
          <p className="text-sm text-gray-400 mt-1">
            Browse the catalog and enroll in a course to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {enrollments.map((course) => (
            <CourseCard key={course.id} course={course} showEnroll={false} />
          ))}
        </div>
      )}
    </div>
  )
}
