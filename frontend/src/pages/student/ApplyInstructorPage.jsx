// ApplyInstructorPage.jsx — student can apply to become an instructor
// POST /api/instructor/apply
import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Briefcase, ChevronRight } from 'lucide-react'

export default function ApplyInstructorPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ bio: '', expertise: '', reason: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.bio.trim()) errs.bio = 'Bio is required'
    if (!form.expertise.trim()) errs.expertise = 'Area of expertise is required'
    if (!form.reason.trim()) errs.reason = 'Please tell us why you want to teach'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      await axiosInstance.post('/api/instructor/apply', form)
      toast.success('Application submitted! We\'ll review it shortly. ✅')
      setSubmitted(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. You may have already applied.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="page-fade min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ChevronRight size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Our admin team will review your application and respond within 2–3 business days.
          </p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-fade max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
          <Briefcase size={24} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Become an Instructor</h1>
          <p className="text-sm text-gray-500">Share your knowledge with thousands of learners</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-6 text-white mb-8">
        <h2 className="font-bold mb-3">Why teach on LearnHub?</h2>
        <ul className="text-sm space-y-2 text-brand-100">
          {[
            'Reach a global audience of eager learners',
            'Earn revenue from every enrollment',
            'Build your personal brand as an expert',
            'Get powerful teaching tools and analytics',
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-yellow-300 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
        <h2 className="font-bold text-gray-900 mb-5">Your Application</h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Bio */}
          <div>
            <label htmlFor="apply-bio" className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="apply-bio"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself and your background…"
              className={`w-full p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition
                ${errors.bio ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
          </div>

          {/* Expertise */}
          <div>
            <label htmlFor="apply-expertise" className="block text-sm font-medium text-gray-700 mb-1.5">
              Area of Expertise <span className="text-red-500">*</span>
            </label>
            <input
              id="apply-expertise"
              type="text"
              value={form.expertise}
              onChange={(e) => setForm({ ...form, expertise: e.target.value })}
              placeholder="e.g. Web Development, Machine Learning, Design…"
              className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition
                ${errors.expertise ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
            {errors.expertise && <p className="text-xs text-red-500 mt-1">{errors.expertise}</p>}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="apply-reason" className="block text-sm font-medium text-gray-700 mb-1.5">
              Why do you want to teach? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="apply-reason"
              rows={4}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Explain your motivation and what value you'll bring to students…"
              className={`w-full p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition
                ${errors.reason ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
            {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
          </div>

          <button
            id="apply-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
