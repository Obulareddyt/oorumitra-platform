import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { vehicleWorkApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import BookingModal from '../components/BookingModal'

const VEHICLE_TYPES = ['ALL', 'TRACTOR', 'ROTAVATOR', 'HARVESTER', 'THRESHER', 'POWER_TILLER', 'OTHERS']
const typeIcon = { TRACTOR: '🚜', ROTAVATOR: '⚙️', HARVESTER: '🌾', THRESHER: '🌀', POWER_TILLER: '🔩', OTHERS: '🚛' }
const typeLabel = (t) => t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

export default function VehicleWork() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [vehicleType, setVehicleType] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    setLoading(true)
    vehicleWorkApi
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
        <h1 className="text-2xl font-bold text-gray-900">{t('vehicles.title', 'Vehicle Work Services 🚜')}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{t('vehicles.subtitle', 'Ploughing, harvesting and field work with agricultural vehicles')}</p>
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
            {tVal === 'ALL' ? t('vehicles.filter.all', 'All Types') : `${typeIcon[tVal] ?? '🚜'} ${t('vehicles.filter.' + tVal.toLowerCase(), typeLabel(tVal))}`}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="🚜" title={t('vehicles.empty_title', 'No vehicle work listings')} description={t('vehicles.empty_desc', 'No vehicles available for field work in this area.')} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((v, i) => (
              <div key={v.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                <VehicleWorkCard item={v} onBook={() => setBooking(v)} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {booking && (
        <BookingModal listing={booking} listingType="VEHICLE_WORK" onClose={() => setBooking(null)} />
      )}
    </div>
  )
}

function VehicleWorkCard({ item, onBook }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="card flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/vehicle-work/${item.id}`)}>
      {item.imageUrls?.length > 0 && (
        <div className="h-32 bg-gray-100 overflow-hidden">
          <img src={item.imageUrls[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-3xl shrink-0">
            {typeIcon[item.vehicleType] ?? '🚜'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{t('vehicles.filter.' + item.vehicleType?.toLowerCase(), typeLabel(item.vehicleType))}</p>
            <p className="text-sm text-gray-500">{item.ownerName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {item.pricePerAcre && (
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">{t('vehicles.per_acre', 'Per Acre')}</p>
              <p className="font-bold text-gray-800">₹{item.pricePerAcre}</p>
            </div>
          )}
          {item.pricePerHour && (
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">{t('transport.rate_per_hour', 'Per Hour')}</p>
              <p className="font-bold text-gray-800">₹{item.pricePerHour}</p>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          {item.village && <p>📍 {item.village}</p>}
          {item.availableUntil && <p>📅 {t('vehicles.available_until', 'Available until')} {item.availableUntil}</p>}
          <span className={`badge ${item.availableStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {item.availableStatus ? `✓ ${t('vehicles.available', 'Available')}` : `✗ ${t('vehicles.unavailable', 'Unavailable')}`}
          </span>
        </div>
        {item.averageRating > 0 && (
          <p className="text-xs text-amber-600">⭐ {item.averageRating?.toFixed(1)} ({item.ratingCount} reviews)</p>
        )}
        <div className="flex gap-2 mt-auto">
          <a href={`tel:${item.mobileNumber}`} className="btn-outline text-xs py-1.5 flex-1 text-center">📞 {t('products.call_seller', 'Call')}</a>
          <button onClick={onBook} disabled={!item.availableStatus} className="btn-primary text-xs py-1.5 flex-1 disabled:opacity-50">{t('vehicles.book', 'Book')}</button>
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
