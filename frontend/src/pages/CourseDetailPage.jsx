// CourseDetailPage.jsx — single course view with lecture list
// GET /api/courses/:id
// Students can enroll via POST /api/enrollments/:courseId
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { BookOpen, User, Clock, CheckCircle, PlayCircle, ArrowLeft } from 'lucide-react'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { role, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get(`/api/courses/${id}`)
      setCourse(data)
    } catch (err) {
      toast.error('Failed to load course details.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll.')
      return navigate('/login')
    }
    setEnrolling(true)
    try {
      await axiosInstance.post(`/api/enrollments`, { courseId: Number(id) })
      toast.success('You are now enrolled! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Enrollment failed. You may already be enrolled.'
      toast.error(msg)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <Spinner />
  if (!course) return null

  const lectures = course.lectures || []

  return (
    <div className="page-fade max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — course info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-900 to-brand-600 rounded-2xl p-7 text-white">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 rounded-full px-3 py-1 mb-4">
              <BookOpen size={12} /> Course
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">{course.title}</h1>
            <p className="text-brand-100 text-sm leading-relaxed">{course.description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-brand-200">
              <User size={15} />
              <span>Instructor: <strong className="text-white">{course.instructorName || 'Unknown'}</strong></span>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-brand-600" /> What you'll learn
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {(course.objectives || ['Comprehensive knowledge of the subject', 'Practical, real-world skills', 'Industry-standard techniques']).map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Lectures */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PlayCircle size={18} className="text-brand-600" /> Course Content
              <span className="text-sm font-normal text-gray-400">({lectures.length} lectures)</span>
            </h2>

            {lectures.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No lectures added yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {lectures.map((lec, idx) => (
                  <li key={lec.id || idx} className="flex items-center gap-3 py-3 text-sm">
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center flex-shrink-0 text-xs">
                      {idx + 1}
                    </div>
                    <span className="text-gray-800 flex-1">{lec.title}</span>
                    {lec.duration && (
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <Clock size={12} /> {lec.duration}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right — enroll card (sticky on desktop) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-xl p-6 space-y-5">
            <div>
              <p className="text-3xl font-extrabold text-brand-700">
                {course.price === 0 || !course.price ? 'Free' : `$${course.price}`}
              </p>
              {course.price > 0 && (
                <p className="text-xs text-gray-400 mt-1">One-time payment, lifetime access</p>
              )}
            </div>

            {role === 'STUDENT' || !isAuthenticated ? (
              <button
                id="enroll-btn"
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold rounded-xl shadow transition-all duration-200 disabled:opacity-60"
              >
                {enrolling ? 'Enrolling…' : isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
              </button>
            ) : (
              <div className="text-center text-sm text-gray-400 italic">
                Enroll is only available to students.
              </div>
            )}

            <ul className="text-sm text-gray-600 space-y-2">
              {[
                'Full lifetime access',
                'Access on mobile & desktop',
                'Certificate of completion',
                '30-day money-back guarantee',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
