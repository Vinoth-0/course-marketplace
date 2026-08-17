// CreateCoursePage.jsx — form to create a new course
// POST /api/courses
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import { PlusCircle } from 'lucide-react'

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Course title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.price === '') errs.price = 'Price is required (use 0 for free)'
    else if (isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = 'Price must be a non-negative number'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const payload = { ...form, price: Number(form.price) }
      const { data } = await axiosInstance.post('/api/courses', payload)
      toast.success('Course created successfully! 🚀')
      navigate(`/instructor/manage/${data.id}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create course.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Reusable field renderer
  const field = (id, label, name, type = 'text', placeholder = '') => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition
          ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-brand-400'}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="page-fade max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
          <PlusCircle size={24} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create New Course</h1>
          <p className="text-sm text-gray-500">Fill in the details to publish your course</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-5">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {field('create-title', 'Course Title', 'title', 'text', 'e.g. Complete React Developer Bootcamp')}

          {/* Description textarea */}
          <div>
            <label htmlFor="create-desc" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="create-desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what students will learn, who this is for, and what's included…"
              className={`w-full p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition
                ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Category + Price side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="create-category" className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                id="create-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition hover:border-brand-400"
              >
                <option value="">Select category</option>
                {['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
                  'DevOps', 'Cloud', 'Design', 'Business', 'Marketing', 'Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="create-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                id="create-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition
                  ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-brand-400'}`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/instructor/dashboard')}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="create-course-submit"
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold rounded-xl shadow transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Creating…' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
