// ManageCoursePage.jsx — edit course details + add/list lectures
// GET /api/courses/:id   → load current data
// PUT /api/courses/:id   → update course
// POST /api/lectures     → add a lecture
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import { Settings, Plus, Trash2, Save, ArrowLeft, PlayCircle } from 'lucide-react'

export default function ManageCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', price: '' })
  const [lectureForm, setLectureForm] = useState({ title: '', videoUrl: '', duration: '' })
  const [lectureErrors, setLectureErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addingLecture, setAddingLecture] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get(`/api/courses/${id}`)
      setCourse(data)
      setForm({ title: data.title, description: data.description, price: data.price ?? '' })
    } catch {
      toast.error('Failed to load course.')
      navigate('/instructor/dashboard')
    } finally {
      setLoading(false)
    }
  }

  // ── Update course details ──────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required.')
    setSaving(true)
    try {
      await axiosInstance.put(`/api/courses/${id}`, { ...form, price: Number(form.price) })
      toast.success('Course updated! ✅')
      fetchCourse()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  // ── Add lecture ────────────────────────────────────────────────────────────
  const validateLecture = () => {
    const errs = {}
    if (!lectureForm.title.trim()) errs.title = 'Lecture title is required'
    return errs
  }

  const handleAddLecture = async (e) => {
    e.preventDefault()
    const errs = validateLecture()
    if (Object.keys(errs).length) return setLectureErrors(errs)

    setAddingLecture(true)
    try {
      // Include courseId in the lecture payload for the backend
      await axiosInstance.post('/api/lectures', { ...lectureForm, courseId: Number(id) })
      toast.success('Lecture added! 🎬')
      setLectureForm({ title: '', videoUrl: '', duration: '' })
      setLectureErrors({})
      fetchCourse() // refresh lecture list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lecture.')
    } finally {
      setAddingLecture(false)
    }
  }

  if (loading) return <Spinner />
  if (!course) return null

  const lectures = course.lectures || []

  return (
    <div className="page-fade max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate('/instructor/dashboard')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
          <Settings size={24} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Course</h1>
          <p className="text-sm text-gray-500 line-clamp-1">{course.title}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* ── Course details form ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-base font-bold text-gray-900 mb-5">Course Details</h2>
          <form onSubmit={handleSave} noValidate className="space-y-4">
            <div>
              <label htmlFor="manage-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                Title
              </label>
              <input
                id="manage-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 hover:border-brand-400 transition"
              />
            </div>

            <div>
              <label htmlFor="manage-desc" className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                id="manage-desc"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            <div className="w-48">
              <label htmlFor="manage-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (USD)
              </label>
              <input
                id="manage-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 hover:border-brand-400 transition"
              />
            </div>

            <div className="flex justify-end">
              <button
                id="save-course-btn"
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow disabled:opacity-60"
              >
                <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Add lecture form ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Plus size={18} className="text-brand-600" /> Add Lecture
          </h2>
          <form onSubmit={handleAddLecture} noValidate className="space-y-4">
            <div>
              <label htmlFor="lec-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                Lecture Title <span className="text-red-500">*</span>
              </label>
              <input
                id="lec-title"
                type="text"
                value={lectureForm.title}
                onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                placeholder="e.g. Introduction to React Hooks"
                className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition
                  ${lectureErrors.title ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
              />
              {lectureErrors.title && <p className="text-xs text-red-500 mt-1">{lectureErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lec-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Video URL
                </label>
                <input
                  id="lec-url"
                  type="url"
                  value={lectureForm.videoUrl}
                  onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/…"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
              <div>
                <label htmlFor="lec-duration" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duration
                </label>
                <input
                  id="lec-duration"
                  type="text"
                  value={lectureForm.duration}
                  onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                  placeholder="e.g. 12:34"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                id="add-lecture-btn"
                type="submit"
                disabled={addingLecture}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow disabled:opacity-60"
              >
                <Plus size={15} /> {addingLecture ? 'Adding…' : 'Add Lecture'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Lecture list ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PlayCircle size={18} className="text-brand-600" />
            Lectures <span className="text-sm font-normal text-gray-400">({lectures.length})</span>
          </h2>

          {lectures.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">
              No lectures added yet. Use the form above to add your first lecture.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {lectures.map((lec, idx) => (
                <li key={lec.id || idx} className="flex items-center gap-3 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lec.title}</p>
                    {lec.videoUrl && (
                      <a href={lec.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline truncate block">
                        {lec.videoUrl}
                      </a>
                    )}
                  </div>
                  {lec.duration && (
                    <span className="text-xs text-gray-400 flex-shrink-0">{lec.duration}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
