import { useEffect, useState } from 'react'
import { bookingsApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const LISTING_TYPE_ICON = { PRODUCT: '🛒', WORKER: '👷', TRANSPORT: '🚛', VEHICLE_WORK: '🚜' }

export default function Bookings() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    setLoading(true)
    bookingsApi
      .getMy({ page, size: 10 })
      .then((data) => {
        setBookings(data.content ?? [])
        setTotalPages(data.totalPages ?? 1)
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [page, isLoggedIn])

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings 📋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track all your service bookings</p>
      </div>

      {loading ? (
        <PageSpinner />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No bookings yet"
          description="Browse services and book your first listing."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl mt-0.5">
                    {LISTING_TYPE_ICON[booking.listingType] ?? '📌'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {booking.listingType?.replace(/_/g, ' ')} Booking
                    </p>
                    <p className="text-sm text-gray-500">Booking #{booking.id}</p>
                    {booking.requiredDate && (
                      <p className="text-sm text-gray-600 mt-1">📅 {booking.requiredDate}</p>
                    )}
                    {booking.amount && (
                      <p className="text-sm text-gray-600">₹{booking.amount?.toLocaleString('en-IN')}</p>
                    )}
                    {booking.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{booking.notes}"</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`badge ${STATUS_COLORS[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'PENDING' && (
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">← Prev</button>
          <span className="px-4 py-1.5 text-sm text-gray-600 font-medium">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  )
}
