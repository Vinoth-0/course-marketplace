// ApplicationsPage.jsx — admin reviews instructor applications
// GET /api/admin/applications
// PUT /api/admin/applications/:id/approve
// PUT /api/admin/applications/:id/reject
import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import { ClipboardList, Check, X } from 'lucide-react'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({}) // { [id]: 'approve'|'reject'|null }

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/api/admin/applications')
      setApplications(data)
    } catch {
      toast.error('Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (appId, action) => {
    setActionLoading((prev) => ({ ...prev, [appId]: action }))
    try {
      await axiosInstance.put(`/api/admin/applications/${appId}/${action}`)
      toast.success(`Application ${action === 'approve' ? 'approved ✅' : 'rejected ❌'}`)
      // Update locally — remove from pending list or update status
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : a))
      )
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} application.`)
    } finally {
      setActionLoading((prev) => ({ ...prev, [appId]: null }))
    }
  }

  const statusBadge = (status) => {
    const map = {
      PENDING:  'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    }
    return map[status] || 'bg-gray-100 text-gray-600'
  }

  const pending  = applications.filter((a) => a.status === 'PENDING')
  const resolved = applications.filter((a) => a.status !== 'PENDING')

  return (
    <div className="page-fade max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
          <ClipboardList size={24} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Instructor Applications</h1>
          <p className="text-sm text-gray-500">Review and manage pending applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending', value: pending.length, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Approved', value: applications.filter((a) => a.status === 'APPROVED').length, color: 'text-green-600 bg-green-50' },
          { label: 'Rejected', value: applications.filter((a) => a.status === 'REJECTED').length, color: 'text-red-600 bg-red-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${color.split(' ')[0]}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No applications yet</h3>
          <p className="text-sm text-gray-400 mt-1">When students apply to become instructors, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending section */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Pending Review ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    actionLoading={actionLoading}
                    onAction={handleAction}
                    statusBadge={statusBadge}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Resolved section */}
          {resolved.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Resolved ({resolved.length})
              </h2>
              <div className="space-y-3">
                {resolved.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    actionLoading={actionLoading}
                    onAction={handleAction}
                    statusBadge={statusBadge}
                    readonly
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Sub-component: individual application card
function ApplicationCard({ app, actionLoading, onAction, statusBadge, readonly = false }) {
  const isLoading = actionLoading[app.id]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{app.applicantName || app.userEmail || 'Applicant'}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge(app.status)}`}>
              {app.status || 'PENDING'}
            </span>
          </div>
          {app.userEmail && app.applicantName && (
            <p className="text-xs text-gray-400">{app.userEmail}</p>
          )}
          {app.expertise && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Expertise:</span> {app.expertise}
            </p>
          )}
          {app.bio && (
            <p className="text-sm text-gray-500 line-clamp-2">{app.bio}</p>
          )}
          {app.reason && (
            <p className="text-sm text-gray-500 italic line-clamp-2">"{app.reason}"</p>
          )}
        </div>

        {/* Action buttons — only for pending */}
        {!readonly && app.status === 'PENDING' && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              id={`approve-${app.id}`}
              onClick={() => onAction(app.id, 'approve')}
              disabled={!!isLoading}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow disabled:opacity-60"
            >
              <Check size={15} />
              {isLoading === 'approve' ? 'Approving…' : 'Approve'}
            </button>
            <button
              id={`reject-${app.id}`}
              onClick={() => onAction(app.id, 'reject')}
              disabled={!!isLoading}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow disabled:opacity-60"
            >
              <X size={15} />
              {isLoading === 'reject' ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
