import { useState } from 'react'
import { bookingsApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function BookingModal({ listing, listingType, onClose }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ serviceDate: '', serviceTime: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isLoggedIn) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🔒</div>
          <p className="font-semibold text-gray-700 mb-4">Sign in to book this listing</p>
          <button
            className="btn-primary"
            onClick={() => { onClose(); navigate('/login') }}
          >
            Sign In
          </button>
        </div>
      </ModalWrapper>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await bookingsApi.create({
        listingId: listing.id,
        listingType,
        ...(form.serviceDate && { serviceDate: form.serviceDate }),
        ...(form.serviceTime && { serviceTime: form.serviceTime }),
        ...(form.notes && { notes: form.notes }),
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper onClose={onClose}>
      {success ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">✅</div>
          <p className="font-semibold text-gray-700 text-lg">Booking Confirmed!</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">The owner has been notified and will contact you.</p>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Book Service</h3>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-semibold text-gray-700">{listing.productName || listing.groupName || listing.ownerName}</p>
            <p className="text-sm text-gray-500">{listing.location || listing.village || ''}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
              <input type="date" className="input" value={form.serviceDate}
                onChange={(e) => setForm({ ...form, serviceDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Time</label>
              <input type="time" className="input" value={form.serviceTime}
                onChange={(e) => setForm({ ...form, serviceTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="input resize-none" rows={3}
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </>
      )}
    </ModalWrapper>
  )
}

function ModalWrapper({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
