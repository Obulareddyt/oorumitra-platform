import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { transportApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import BookingModal from '../components/BookingModal'
import { useAuth } from '../context/AuthContext'

const VEHICLE_TYPES = ['ALL', 'AUTO', 'TRACTOR', 'MINI_TRUCK', 'LORRY', 'BUS']
const vehicleIcon = { AUTO: '🛺', TRACTOR: '🚜', MINI_TRUCK: '🚐', LORRY: '🚛', BUS: '🚌' }
const vehicleLabel = { AUTO: 'Auto', TRACTOR: 'Tractor', MINI_TRUCK: 'Mini Truck', LORRY: 'Lorry', BUS: 'Bus' }

export default function Transport() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [vehicleType, setVehicleType] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    setLoading(true)
    transportApi
      .getAll({ vehicleType: vehicleType === 'ALL' ? undefined : vehicleType, page, size: 12 })
      .then((data) => {
        setItems(data.content ?? [])
        setTotalPages(data.totalPages ?? 1)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [vehicleType, page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('transport.title', 'Transport Services 🚛')}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{t('transport.subtitle', 'Hire vehicles for transporting goods across villages')}</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {VEHICLE_TYPES.map((tVal) => (
          <button
            key={tVal}
            onClick={() => { setVehicleType(tVal); setPage(0) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              vehicleType === tVal
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {tVal === 'ALL' ? t('transport.filter.all', 'All Vehicles') : `${vehicleIcon[tVal]} ${t('transport.filter.' + tVal.toLowerCase(), vehicleLabel[tVal])}`}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="🚛" title={t('transport.empty_title', 'No transport listings')} description={t('transport.empty_desc', 'No vehicles available for the selected type.')} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((tItem, i) => (
              <div key={tItem.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                <TransportCard transport={tItem} onBook={() => setBooking(tItem)} isOwner={user && Number(user.userId || user.id) === Number(tItem.userId)} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {booking && (
        <BookingModal listing={booking} listingType="TRANSPORT" onClose={() => setBooking(null)} />
      )}
    </div>
  )
}

function TransportCard({ transport, onBook, isOwner }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="card flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/transport/${transport.id}`)}>
      {transport.imageUrls?.length > 0 && (
        <div className="h-32 bg-gray-100 overflow-hidden">
          <img src={transport.imageUrls[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-3xl shrink-0">
            {vehicleIcon[transport.vehicleType] ?? '🚚'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{t('transport.filter.' + transport.vehicleType?.toLowerCase(), vehicleLabel[transport.vehicleType])}</p>
            <p className="text-sm text-gray-500">{transport.ownerName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {transport.amount != null && (
            <div className="bg-gray-50 rounded-lg p-2 text-center col-span-2">
              <p className="text-gray-400 text-xs">Per {transport.priceType}</p>
              <p className="font-bold text-gray-800">₹{transport.amount?.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          {transport.weightCapacity && <p>⚖️ {t('transport.capacity', 'Capacity')}: {transport.weightCapacity}</p>}
          {transport.availability && <p>🕐 {transport.availability}</p>}
          {transport.negotiable && <span className="badge bg-green-100 text-green-700">{t('products.negotiable', 'Negotiable')}</span>}
        </div>
        {transport.averageRating > 0 && (
          <p className="text-xs text-amber-600">⭐ {transport.averageRating?.toFixed(1)} ({transport.ratingCount} reviews)</p>
        )}
        <div className="flex gap-2 mt-auto">
          <a href={`tel:${transport.mobileNumber}`} className="btn-outline text-xs py-1.5 flex-1 text-center">📞 {t('products.call_seller', 'Call')}</a>
          {!isOwner && (
            <button onClick={onBook} className="btn-primary text-xs py-1.5 flex-1">{t('vehicles.book', 'Book')}</button>
          )}
        </div>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-8">
      <button disabled={page === 0} onClick={() => onChange(page - 1)} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">← Prev</button>
      <span className="px-4 py-1.5 text-sm text-gray-600 font-medium">Page {page + 1} of {totalPages}</span>
      <button disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">Next →</button>
    </div>
  )
}
