import { useEffect, useState } from 'react'
import { bookingsApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  INTERESTED: 'bg-amber-100 text-amber-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  PURCHASED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const LISTING_TYPE_ICON = { PRODUCT: '🛒', WORKER: '👷', TRANSPORT: '🚛', VEHICLE_WORK: '🚜' }

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending', statuses: ['INTERESTED', 'CONTACTED', 'PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
  { key: 'COMPLETED', label: 'Completed', statuses: ['PURCHASED', 'COMPLETED'] },
  { key: 'CANCELLED', label: 'Cancelled', statuses: ['CANCELLED'] },
]

const NON_TERMINAL = ['INTERESTED', 'CONTACTED', 'PENDING', 'ACCEPTED', 'IN_PROGRESS']

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Bookings() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    setLoading(true)
    bookingsApi
      .getMy({ page: 0, size: 100 })
      .then((data) => setBookings(data.content ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    setUpdating(id)
    try {
      const updated = await bookingsApi.updateStatus(id, 'CANCELLED')
      setBookings((prev) => prev.map((b) => b.id === id ? updated : b))
    } catch {
      // ignore
    } finally {
      setUpdating(null)
    }
  }

  const activeFilter = FILTERS.find(f => f.key === filter)
  const visible = activeFilter?.statuses
    ? bookings.filter(b => activeFilter.statuses.includes(b.status))
    : bookings

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings 📋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track your interest and service bookings</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filter === f.key ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : visible.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No bookings yet"
          description="Browse products and services, then express interest or book to see them here."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((booking) => (
            <div key={booking.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl mt-0.5">
                    {LISTING_TYPE_ICON[booking.listingType] ?? '📌'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{booking.listingName || `${booking.listingType?.replace(/_/g, ' ')} Listing`}</p>
                    <p className="text-sm text-gray-500">Owner: {booking.ownerName || '—'}</p>
                    <p className="text-sm text-gray-500">Booked on {fmtDate(booking.createdAt)}</p>
                    {booking.requiredDate && (
                      <p className="text-sm text-gray-600 mt-1">📅 {booking.requiredDate}{booking.serviceTime ? ` at ${booking.serviceTime}` : ''}</p>
                    )}
                    {booking.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{booking.notes}"</p>
                    )}
                    {booking.ownerMobile && (
                      <div className="flex gap-2 mt-3">
                        <a href={`tel:${booking.ownerMobile}`} onClick={e => e.stopPropagation()}
                          className="btn-outline text-xs py-1.5 px-3 font-bold uppercase tracking-wide flex items-center gap-1">
                          📞 Call
                        </a>
                        <a href={`https://wa.me/91${booking.ownerMobile}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="btn-primary text-xs py-1.5 px-3 font-bold uppercase tracking-wide flex items-center gap-1 bg-green-600 hover:bg-green-700 border-transparent">
                          💬 WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`badge ${STATUS_COLORS[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {booking.status?.replace(/_/g, ' ')}
                  </span>
                  {NON_TERMINAL.includes(booking.status) && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={updating === booking.id}
                      className="mt-2 block text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {updating === booking.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
