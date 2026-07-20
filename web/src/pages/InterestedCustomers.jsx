import { useEffect, useState } from 'react'
import { bookingsApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast, { useToast } from '../components/Toast'

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

// Mirrors the backend's forward-only flow (BookingService.PRODUCT_FLOW / SERVICE_FLOW).
const NEXT_STATUS = {
  INTERESTED: 'CONTACTED',
  CONTACTED: 'PURCHASED',
  PENDING: 'ACCEPTED',
  ACCEPTED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
}
const TERMINAL = ['PURCHASED', 'COMPLETED', 'CANCELLED']

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending', statuses: ['INTERESTED', 'CONTACTED', 'PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
  { key: 'COMPLETED', label: 'Completed', statuses: ['PURCHASED', 'COMPLETED'] },
  { key: 'CANCELLED', label: 'Cancelled', statuses: ['CANCELLED'] },
]

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function InterestedCustomers() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    bookingsApi
      .getOwner({ page: 0, size: 100 })
      .then((data) => setBookings(data.content ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const updated = await bookingsApi.updateStatus(id, status)
      setBookings((prev) => prev.map((b) => b.id === id ? updated : b))
      toast.add(`Marked as ${status.replace(/_/g, ' ')}`, 'success')
    } catch (err) {
      toast.add(err.message || 'Failed to update status', 'error')
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
      <Toast toasts={toast.toasts} remove={toast.remove} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Interested Customers 🧑‍🤝‍🧑</h1>
        <p className="text-gray-500 text-sm mt-0.5">Customers interested in or booking your listings</p>
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
          icon="🧑‍🤝‍🧑"
          title="No interested customers yet"
          description="When someone shows interest in or books your listings, they'll show up here."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((booking) => {
            const next = NEXT_STATUS[booking.status]
            const isTerminal = TERMINAL.includes(booking.status)
            return (
              <div key={booking.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl mt-0.5">
                      {LISTING_TYPE_ICON[booking.listingType] ?? '📌'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.customerMobile}</p>
                      <p className="text-sm text-gray-500">For: {booking.listingName}</p>
                      <p className="text-sm text-gray-500">Booked on {fmtDate(booking.createdAt)}</p>
                      {booking.requiredDate && (
                        <p className="text-sm text-gray-600 mt-1">📅 {booking.requiredDate}{booking.serviceTime ? ` at ${booking.serviceTime}` : ''}</p>
                      )}
                      {booking.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">"{booking.notes}"</p>
                      )}
                      {booking.customerMobile && (
                        <div className="flex gap-2 mt-3">
                          <a href={`tel:${booking.customerMobile}`}
                            className="btn-outline text-xs py-1.5 px-3 font-bold uppercase tracking-wide flex items-center gap-1">
                            📞 Call
                          </a>
                          <a href={`https://wa.me/91${booking.customerMobile}`} target="_blank" rel="noopener noreferrer"
                            className="btn-primary text-xs py-1.5 px-3 font-bold uppercase tracking-wide flex items-center gap-1 bg-green-600 hover:bg-green-700 border-transparent">
                            💬 WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <span className={`badge ${STATUS_COLORS[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {booking.status?.replace(/_/g, ' ')}
                    </span>
                    {!isTerminal && (
                      <div className="flex flex-col gap-1 items-end">
                        {next && (
                          <button
                            onClick={() => updateStatus(booking.id, next)}
                            disabled={updating === booking.id}
                            className="text-xs font-bold text-primary-600 hover:underline disabled:opacity-50"
                          >
                            Mark as {next.replace(/_/g, ' ')}
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(booking.id, 'CANCELLED')}
                          disabled={updating === booking.id}
                          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
