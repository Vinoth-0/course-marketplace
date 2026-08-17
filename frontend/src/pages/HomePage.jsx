// HomePage.jsx — public course catalog
// GET /api/courses → display all available courses in a grid
// Students see an Enroll button; guests see "Login to Enroll"
import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import CourseCard from '../components/CourseCard'
import Spinner from '../components/Spinner'
import { Search, BookOpen, Users, Award } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, role } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/api/courses')
      setCourses(data)
    } catch (err) {
      toast.error('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) return toast.info('Please login to enroll in a course.')
    try {
      await axiosInstance.post(`/api/enrollments`, { courseId })
      toast.success('Enrolled successfully! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Enrollment failed. You may already be enrolled.'
      toast.error(msg)
    }
  }

  // Client-side search filter
  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase()) ||
      c.instructorName?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page-fade">
      {/* Hero banner */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Learn Without{' '}
            <span className="text-yellow-300">Limits</span>
          </h1>
          <p className="text-lg sm:text-xl text-brand-100 max-w-2xl mx-auto mb-8">
            Explore thousands of courses taught by world-class instructors. Start your learning journey today.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="course-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, topics, instructors…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-gray-900 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { icon: BookOpen, label: 'Courses', value: `${courses.length}+` },
              { icon: Users, label: 'Students', value: '50K+' },
              { icon: Award, label: 'Instructors', value: '200+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-brand-100">
                <Icon size={20} className="text-yellow-300" />
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : 'All Courses'}
          </h2>
          <span className="text-sm text-gray-400">{filtered.length} course{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No courses found</h3>
            <p className="text-sm text-gray-400 mt-1">
              {query ? 'Try a different search term.' : 'Check back later — more courses coming soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showEnroll={role === 'STUDENT'}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
