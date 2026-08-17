// CourseCard.jsx — reusable card for any course listing
// Props:
//   course    — course object from API
//   onEnroll  — optional callback when "Enroll" is clicked (student only)
//   showEnroll — boolean flag to show/hide Enroll button
import { Link } from 'react-router-dom'
import { BookOpen, User, ArrowRight } from 'lucide-react'

export default function CourseCard({ course, onEnroll, showEnroll = false }) {
  const { id, title, description, instructorName, price } = course

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col">
      {/* Coloured header band — adds visual variety */}
      <div className="h-2 bg-gradient-to-r from-brand-600 to-brand-400" />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category pill */}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 rounded-full px-2.5 py-1 w-fit">
          <BookOpen size={12} />
          Course
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>

        {/* Description — truncated to 3 lines */}
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">
          {description || 'No description provided.'}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <User size={13} />
          <span>{instructorName || 'Unknown Instructor'}</span>
        </div>

        {/* Price */}
        {price !== undefined && (
          <p className="text-lg font-bold text-brand-700">
            {price === 0 ? 'Free' : `$${price}`}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <Link
            to={`/courses/${id}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View Details <ArrowRight size={14} />
          </Link>

          {showEnroll && onEnroll && (
            <button
              onClick={() => onEnroll(id)}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
